#!/bin/bash
set -euo pipefail

# ===== Configuration =====
CURRENT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CONTRACT_DIR="$CURRENT_DIR/../notarization-move"
GAS_BUDGET=500000000

# Package address of the notarization module (update after publishing)
PACKAGE_ADDRESS="0x07c91ae86e3d0fe11a46a69847308819f4d9e77a4f3d57a01d449a7951cea756"
CLOCK_ADDRESS="@0x6" # Special address for the clock module

# ===== Core Functions =====
publish_contract() {
    echo "Publishing contract from: $CONTRACT_DIR"
    iota client publish "$CONTRACT_DIR" \
        --skip-dependency-verification \
        --gas-budget "$GAS_BUDGET"
    echo "Contract published successfully."
    echo "IMPORTANT: Update PACKAGE_ADDRESS in this script with the new package address"
}

create_dynamic_notarization() {
    local data="$1"
    local state_metadata="$2"
    local immutable_description="$3"
    local updateable_metadata="$4"
    local transfer_lock="$5"

    echo "Creating dynamic notarization..."
    echo "Data: $data"
    echo "State metadata: $state_metadata"
    echo "Updateable metadata: $updateable_metadata"
    echo "Immutable description: $immutable_description"

    # Handle optional transfer lock
    local transfer_lock_cmd=""
    if [ -n "$transfer_lock" ] && [ "$transfer_lock" != "none" ]; then
        echo "Transfer lock: $transfer_lock"
        transfer_lock_cmd="--move-call \"$PACKAGE_ADDRESS::timelock::unlock_at\" $transfer_lock \"$CLOCK_ADDRESS\" --assign transfer_lock"
        transfer_lock_param="--move-call std::option::some \"<${PACKAGE_ADDRESS}::timelock::TimeLock>\" transfer_lock"
    else
        transfer_lock_param="--move-call std::option::none \"<${PACKAGE_ADDRESS}::timelock::TimeLock>\""
    fi

    # Build and execute the transaction
    cmd="iota client ptb \
        --move-call std::option::some \"<std::string::String>\" \"'$immutable_description'\" \
        --assign immutable_description_option \
        --move-call std::option::some \"<std::string::String>\" \"'$updateable_metadata'\" \
        --assign updateable_metadata_option \
        --move-call std::option::some \"<std::string::String>\" \"'$state_metadata'\" \
        --assign state_metadata_option \
        --move-call \"$PACKAGE_ADDRESS::notarization::new_state_from_string\" \"'$data'\" \"state_metadata_option\" \
        --assign move_call_state \
        $transfer_lock_cmd \
        $transfer_lock_param \
        --assign transfer_lock_option \
        --move-call \"$PACKAGE_ADDRESS::dynamic_notarization::create\" \
        \"<std::string::String>\" \
        move_call_state \
        immutable_description_option \
        updateable_metadata_option \
        transfer_lock_option \
        \"$CLOCK_ADDRESS\" \
        --gas-budget \"$GAS_BUDGET\""

    # Remove any duplicate whitespace for cleaner command
    cmd=$(echo "$cmd" | tr -s ' ')
    eval "$cmd"
}

create_locked_notarization() {
    local data="$1"
    local state_metadata="$2"
    local updateable_metadata="$3"
    local immutable_description="$4"
    local delete_lock="$5"

    echo "Creating locked notarization..."
    echo "Data: $data"
    echo "Updateable metadata: $updateable_metadata"
    echo "Immutable description: $immutable_description"
    echo "Delete lock: $delete_lock"

    # Build the delete lock
    local delete_lock_cmd=""
    if [ "$delete_lock" == "until_destroyed" ]; then
        delete_lock_cmd="--move-call \"$PACKAGE_ADDRESS::timelock::until_destroyed\" --assign delete_lock"
    else
        delete_lock_cmd="--move-call \"$PACKAGE_ADDRESS::timelock::unlock_at\" $delete_lock \"$CLOCK_ADDRESS\" --assign delete_lock"
    fi

    # Build and execute the transaction
    cmd="iota client ptb \
        --move-call std::option::some \"<std::string::String>\" \"'$immutable_description'\" \
        --assign immutable_description_option \
        --move-call std::option::some \"<std::string::String>\" \"'$updateable_metadata'\" \
        --assign updateable_metadata_option \
        --move-call std::option::some \"<std::string::String>\" \"'$state_metadata'\" \
        --assign state_metadata_option \
        --move-call \"$PACKAGE_ADDRESS::notarization::new_state_from_string\" \
        \"'$data'\" \"state_metadata_option\" \
        --assign move_call_state \
        $delete_lock_cmd \
        --move-call \"$PACKAGE_ADDRESS::locked_notarization::create\" \
        \"<std::string::String>\" \
        move_call_state \
        immutable_description_option \
        updateable_metadata_option \
        delete_lock \
        \"$CLOCK_ADDRESS\" \
        --gas-budget \"$GAS_BUDGET\""

    # Remove any duplicate whitespace for cleaner command
    cmd=$(echo "$cmd" | tr -s ' ')
    eval "$cmd"
}

update_state() {
    local notarization_id="$1"
    local new_data="$2"
    local new_state_metadata="$3"

    echo "Updating notarization state..."
    echo "Notarization ID: $notarization_id"
    echo "New data: $new_data"
    echo "New state metadata: $new_state_metadata"

    iota client ptb \
        --move-call std::option::some "<std::string::String>" \"'$new_state_metadata'\" \
        --assign state_metadata_option \
        --move-call "$PACKAGE_ADDRESS::notarization::new_state_from_string" \
        "'$new_data'" state_metadata_option \
        --assign new_state \
        --move-call "$PACKAGE_ADDRESS::notarization::update_state" \
        "<std::string::String>" \
        "@$notarization_id" \
        new_state \
        "$CLOCK_ADDRESS" \
        --gas-budget "$GAS_BUDGET"
}

destroy_notarization() {
    local notarization_id="$1"

    echo "Destroying notarization: $notarization_id"
    iota client call \
        --package "$PACKAGE_ADDRESS" \
        --module notarization \
        --function destroy \
        --type-args "<std::string::String>" \
        --args "$notarization_id" "$CLOCK_ADDRESS" \
        --gas-budget "$GAS_BUDGET"
}

transfer_notarization() {
    local notarization_id="$1"
    local recipient="$2"

    echo "Transferring notarization: $notarization_id to $recipient"
    iota client call \
        --package "$PACKAGE_ADDRESS" \
        --module dynamic_notarization \
        --function transfer \
        --type-args "<std::string::String>" \
        --args "$notarization_id" "$recipient" "$CLOCK_ADDRESS" \
        --gas-budget "$GAS_BUDGET"
}

usage() {
    echo "Usage: $0 <command> [arguments]"
    echo
    echo "Commands:"
    echo "  publish                                                  Publish the contract"
    echo "  create-dynamic <data> <state_metadata> <updateable_metadata> <immutable_description> [transfer_lock]  Create a dynamic notarization"
    echo "                                                          [transfer_lock] is optional Unix timestamp or 'none'"
    echo "  create-locked <data> <state_metadata> <updateable_metadata> <immutable_description> <delete_lock>     Create a locked notarization"
    echo "                                                          <delete_lock> is Unix timestamp or 'until_destroyed'"
    echo "  update <id> <new_data> <new_state_metadata>           Update notarization state"
    echo "  destroy <id>                                            Destroy a notarization"
    echo "  transfer <id> <recipient>                               Transfer a dynamic notarization"
    echo
    echo "Examples:"
    echo "  $0 create-dynamic 'Hello World' 'Test data' 'My notarization' 'My notarization'"
    echo "  $0 create-dynamic 'Hello World' 'Test data' 'My notarization' 'My notarization' 2051218800"
    echo "  $0 create-locked 'Hello World' 'Test data' 'Locked notarization' 'Locked notarization' 2051218800"
    echo "  $0 create-locked 'Hello World' 'Test data' 'Locked notarization' 'Locked notarization' until_destroyed"
    echo "  $0 update 0x123...abc 'Updated data' 'Updated state metadata'"
    echo "  $0 transfer 0x123...abc 0x456...def"
}

case "${1:-}" in
publish)
    publish_contract
    ;;
create-dynamic)
    if [ $# -lt 5 ]; then
        echo "Error: create-dynamic requires at least 5 arguments: <data> <state_metadata> <updateable_metadata> <immutable_description> [transfer_lock]"
        exit 1
    fi
    transfer_lock="${6:-none}"
    create_dynamic_notarization "$2" "$3" "$4" "$5" "$transfer_lock"
    ;;
create-locked)
    if [ $# -lt 5 ]; then
        echo "Error: create-locked requires at least 5 arguments: <data> <state_metadata> <updateable_metadata> <immutable_description> <delete_lock>"
        exit 1
    fi
    create_locked_notarization "$2" "$3" "$4" "$5" "$6"
    ;;
update)
    if [ $# -ne 4 ]; then
        echo "Error: update requires 3 arguments: <id> <new_data> <new_state_metadata>"
        exit 1
    fi
    update_state "$2" "$3" "$4"
    ;;
destroy)
    if [ $# -ne 2 ]; then
        echo "Error: destroy requires 1 argument: <id>"
        exit 1
    fi
    destroy_notarization "$2"
    ;;
transfer)
    if [ $# -ne 3 ]; then
        echo "Error: transfer requires 2 arguments: <id> <recipient>"
        exit 1
    fi
    transfer_notarization "$2" "$3"
    ;;
*)
    usage
    exit 1
    ;;
esac
