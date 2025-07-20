module profile_contract::profile {
    use std::signer;
    use std::string::{Self, String};
    use std::vector;
    use iota::isc::*;
    use iota::isc::account::*;
    use iota::isc::blob::*;
    use iota::isc::core::*;
    use iota::isc::params::*;
    use iota::isc::results::*;
    use iota::isc::schema::*;
    use iota::isc::timestamp::*;

    // Error codes
    const E_PROFILE_ALREADY_EXISTS: u64 = 1;
    const E_PROFILE_NOT_FOUND: u64 = 2;
    const E_INVALID_PROFILE_TYPE: u64 = 3;
    const E_INVALID_DID: u64 = 4;
    const E_UNAUTHORIZED: u64 = 5;
    const E_INVALID_NAME: u64 = 6;
    const E_INVALID_EMAIL: u64 = 7;
    const E_INVALID_WEBSITE: u64 = 8;

    // Profile types
    const PROFILE_TYPE_INDIVIDUAL: u8 = 1;
    const PROFILE_TYPE_ORGANIZATION: u8 = 2;
    const PROFILE_TYPE_GOVERNMENT: u8 = 3;

    // Organization types
    const ORG_TYPE_UNIVERSITY: u8 = 1;
    const ORG_TYPE_COMPANY: u8 = 2;
    const ORG_TYPE_NONPROFIT: u8 = 3;
    const ORG_TYPE_RESEARCH: u8 = 4;
    const ORG_TYPE_OTHER: u8 = 5;

    // Government levels
    const GOV_LEVEL_FEDERAL: u8 = 1;
    const GOV_LEVEL_STATE: u8 = 2;
    const GOV_LEVEL_LOCAL: u8 = 3;
    const GOV_LEVEL_INTERNATIONAL: u8 = 4;

    // Profile struct
    struct Profile has key, store, drop {
        did: String,
        profile_type: u8,
        name: String,
        email: String,
        website: String,
        description: String,
        organization_type: u8,
        government_level: u8,
        created_at: u64,
        updated_at: u64,
        is_active: bool,
        owner: address,
    }

    // Profile metadata for events
    struct ProfileCreated has drop, store {
        did: String,
        profile_type: u8,
        name: String,
        owner: address,
        timestamp: u64,
    }

    struct ProfileUpdated has drop, store {
        did: String,
        profile_type: u8,
        name: String,
        owner: address,
        timestamp: u64,
    }

    struct ProfileDeactivated has drop, store {
        did: String,
        owner: address,
        timestamp: u64,
    }

    // Global storage
    struct ProfileStore has key {
        profiles: Table<String, Profile>,
        did_to_profile: Table<String, String>, // DID -> profile key mapping
        owner_profiles: Table<address, vector<String>>, // Owner -> list of profile keys
        total_profiles: u64,
    }

    // Initialize the contract
    fun init(ctx: &mut TxContext) {
        let profile_store = ProfileStore {
            profiles: table::new(ctx),
            did_to_profile: table::new(ctx),
            owner_profiles: table::new(ctx),
            total_profiles: 0,
        };
        move_to(ctx, profile_store);
    }

    // Create a new profile
    public entry fun create_profile(
        ctx: &mut TxContext,
        did: vector<u8>,
        profile_type: u8,
        name: vector<u8>,
        email: vector<u8>,
        website: vector<u8>,
        description: vector<u8>,
        organization_type: u8,
        government_level: u8,
    ) {
        let sender = ctx.sender;
        let did_str = string::utf8(did);
        let name_str = string::utf8(name);
        let email_str = string::utf8(email);
        let website_str = string::utf8(website);
        let description_str = string::utf8(description);
        let timestamp = timestamp::now_seconds(ctx);

        // Validate inputs
        assert!(is_valid_profile_type(profile_type), E_INVALID_PROFILE_TYPE);
        assert!(is_valid_did(&did_str), E_INVALID_DID);
        assert!(is_valid_name(&name_str), E_INVALID_NAME);
        assert!(is_valid_email(&email_str), E_INVALID_EMAIL);
        assert!(is_valid_website(&website_str), E_INVALID_WEBSITE);

        // Validate profile type specific fields
        if (profile_type == PROFILE_TYPE_ORGANIZATION) {
            assert!(is_valid_organization_type(organization_type), E_INVALID_PROFILE_TYPE);
        };
        if (profile_type == PROFILE_TYPE_GOVERNMENT) {
            assert!(is_valid_government_level(government_level), E_INVALID_PROFILE_TYPE);
        };

        let profile_store = borrow_global_mut<ProfileStore>(@profile_contract);

        // Check if profile already exists for this DID
        assert!(!table::contains(&profile_store.did_to_profile, did_str), E_PROFILE_ALREADY_EXISTS);

        // Create profile
        let profile = Profile {
            did: did_str,
            profile_type,
            name: name_str,
            email: email_str,
            website: website_str,
            description: description_str,
            organization_type,
            government_level,
            created_at: timestamp,
            updated_at: timestamp,
            is_active: true,
            owner: sender,
        };

        // Generate unique profile key
        let profile_key = generate_profile_key(profile_store.total_profiles);
        profile_store.total_profiles = profile_store.total_profiles + 1;

        // Store profile
        table::add(&mut profile_store.profiles, profile_key, profile);
        table::add(&mut profile_store.did_to_profile, did_str, profile_key);

        // Add to owner's profile list
        if (!table::contains(&profile_store.owner_profiles, sender)) {
            table::add(&mut profile_store.owner_profiles, sender, vector::empty<String>());
        };
        let owner_profiles = table::borrow_mut(&mut profile_store.owner_profiles, sender);
        vector::push_back(owner_profiles, profile_key);

        // Emit event
        let event = ProfileCreated {
            did: did_str,
            profile_type,
            name: name_str,
            owner: sender,
            timestamp,
        };
        event::emit(event);
    }

    // Update an existing profile
    public entry fun update_profile(
        ctx: &mut TxContext,
        did: vector<u8>,
        name: vector<u8>,
        email: vector<u8>,
        website: vector<u8>,
        description: vector<u8>,
        organization_type: u8,
        government_level: u8,
    ) {
        let sender = ctx.sender;
        let did_str = string::utf8(did);
        let name_str = string::utf8(name);
        let email_str = string::utf8(email);
        let website_str = string::utf8(website);
        let description_str = string::utf8(description);
        let timestamp = timestamp::now_seconds(ctx);

        // Validate inputs
        assert!(is_valid_name(&name_str), E_INVALID_NAME);
        assert!(is_valid_email(&email_str), E_INVALID_EMAIL);
        assert!(is_valid_website(&website_str), E_INVALID_WEBSITE);

        let profile_store = borrow_global_mut<ProfileStore>(@profile_contract);

        // Get profile
        assert!(table::contains(&profile_store.did_to_profile, did_str), E_PROFILE_NOT_FOUND);
        let profile_key = *table::borrow(&profile_store.did_to_profile, did_str);
        let profile = table::borrow_mut(&mut profile_store.profiles, profile_key);

        // Check authorization
        assert!(profile.owner == sender, E_UNAUTHORIZED);
        assert!(profile.is_active, E_PROFILE_NOT_FOUND);

        // Validate profile type specific fields
        if (profile.profile_type == PROFILE_TYPE_ORGANIZATION) {
            assert!(is_valid_organization_type(organization_type), E_INVALID_PROFILE_TYPE);
        };
        if (profile.profile_type == PROFILE_TYPE_GOVERNMENT) {
            assert!(is_valid_government_level(government_level), E_INVALID_PROFILE_TYPE);
        };

        // Update profile
        profile.name = name_str;
        profile.email = email_str;
        profile.website = website_str;
        profile.description = description_str;
        profile.organization_type = organization_type;
        profile.government_level = government_level;
        profile.updated_at = timestamp;

        // Emit event
        let event = ProfileUpdated {
            did: did_str,
            profile_type: profile.profile_type,
            name: name_str,
            owner: sender,
            timestamp,
        };
        event::emit(event);
    }

    // Deactivate a profile
    public entry fun deactivate_profile(ctx: &mut TxContext, did: vector<u8>) {
        let sender = ctx.sender;
        let did_str = string::utf8(did);
        let timestamp = timestamp::now_seconds(ctx);

        let profile_store = borrow_global_mut<ProfileStore>(@profile_contract);

        // Get profile
        assert!(table::contains(&profile_store.did_to_profile, did_str), E_PROFILE_NOT_FOUND);
        let profile_key = *table::borrow(&profile_store.did_to_profile, did_str);
        let profile = table::borrow_mut(&mut profile_store.profiles, profile_key);

        // Check authorization
        assert!(profile.owner == sender, E_UNAUTHORIZED);
        assert!(profile.is_active, E_PROFILE_NOT_FOUND);

        // Deactivate profile
        profile.is_active = false;
        profile.updated_at = timestamp;

        // Emit event
        let event = ProfileDeactivated {
            did: did_str,
            owner: sender,
            timestamp,
        };
        event::emit(event);
    }

    // Reactivate a profile
    public entry fun reactivate_profile(ctx: &mut TxContext, did: vector<u8>) {
        let sender = ctx.sender;
        let did_str = string::utf8(did);
        let timestamp = timestamp::now_seconds(ctx);

        let profile_store = borrow_global_mut<ProfileStore>(@profile_contract);

        // Get profile
        assert!(table::contains(&profile_store.did_to_profile, did_str), E_PROFILE_NOT_FOUND);
        let profile_key = *table::borrow(&profile_store.did_to_profile, did_str);
        let profile = table::borrow_mut(&mut profile_store.profiles, profile_key);

        // Check authorization
        assert!(profile.owner == sender, E_UNAUTHORIZED);
        assert!(!profile.is_active, E_PROFILE_NOT_FOUND);

        // Reactivate profile
        profile.is_active = true;
        profile.updated_at = timestamp;
    }

    // Get profile by DID
    public fun get_profile_by_did(did: vector<u8>): Profile {
        let did_str = string::utf8(did);
        let profile_store = borrow_global<ProfileStore>(@profile_contract);

        assert!(table::contains(&profile_store.did_to_profile, did_str), E_PROFILE_NOT_FOUND);
        let profile_key = *table::borrow(&profile_store.did_to_profile, did_str);
        let profile = table::borrow(&profile_store.profiles, profile_key);

        assert!(profile.is_active, E_PROFILE_NOT_FOUND);
        *profile
    }

    // Get profiles by owner
    public fun get_profiles_by_owner(owner: address): vector<Profile> {
        let profile_store = borrow_global<ProfileStore>(@profile_contract);
        let profiles = vector::empty<Profile>();

        if (table::contains(&profile_store.owner_profiles, owner)) {
            let profile_keys = table::borrow(&profile_store.owner_profiles, owner);
            let i = 0;
            let len = vector::length(profile_keys);
            while (i < len) {
                let profile_key = *vector::borrow(profile_keys, i);
                let profile = table::borrow(&profile_store.profiles, profile_key);
                if (profile.is_active) {
                    vector::push_back(&mut profiles, *profile);
                };
                i = i + 1;
            };
        };

        profiles
    }

    // Get total profile count
    public fun get_total_profiles(): u64 {
        let profile_store = borrow_global<ProfileStore>(@profile_contract);
        profile_store.total_profiles
    }

    // Helper functions
    fun generate_profile_key(index: u64): String {
        string::utf8(b"profile_") + string::utf8((&index).to_bytes())
    }

    fun is_valid_profile_type(profile_type: u8): bool {
        profile_type == PROFILE_TYPE_INDIVIDUAL ||
        profile_type == PROFILE_TYPE_ORGANIZATION ||
        profile_type == PROFILE_TYPE_GOVERNMENT
    }

    fun is_valid_organization_type(org_type: u8): bool {
        org_type == ORG_TYPE_UNIVERSITY ||
        org_type == ORG_TYPE_COMPANY ||
        org_type == ORG_TYPE_NONPROFIT ||
        org_type == ORG_TYPE_RESEARCH ||
        org_type == ORG_TYPE_OTHER
    }

    fun is_valid_government_level(gov_level: u8): bool {
        gov_level == GOV_LEVEL_FEDERAL ||
        gov_level == GOV_LEVEL_STATE ||
        gov_level == GOV_LEVEL_LOCAL ||
        gov_level == GOV_LEVEL_INTERNATIONAL
    }

    fun is_valid_did(did: &String): bool {
        let did_bytes = string::bytes(did);
        let len = vector::length(&did_bytes);
        len > 0 && len <= 1000 // Basic length validation
    }

    fun is_valid_name(name: &String): bool {
        let name_bytes = string::bytes(name);
        let len = vector::length(&name_bytes);
        len > 0 && len <= 200
    }

    fun is_valid_email(email: &String): bool {
        let email_bytes = string::bytes(email);
        let len = vector::length(&email_bytes);
        len <= 255 && string::index_of(email, &string::utf8(b"@")) > 0
    }

    fun is_valid_website(website: &String): bool {
        let website_bytes = string::bytes(website);
        let len = vector::length(&website_bytes);
        len <= 500
    }

    // Test functions
    #[test_only]
    public fun test_create_profile(ctx: &mut TxContext) {
        let did = b"did:iota:test:123456789";
        let name = b"Test User";
        let email = b"test@example.com";
        let website = b"https://example.com";
        let description = b"Test profile";

        create_profile(
            ctx,
            did,
            PROFILE_TYPE_INDIVIDUAL,
            name,
            email,
            website,
            description,
            0, // Not used for individual
            0, // Not used for individual
        );

        let profile = get_profile_by_did(did);
        assert!(profile.name == string::utf8(name), 0);
        assert!(profile.profile_type == PROFILE_TYPE_INDIVIDUAL, 0);
        assert!(profile.is_active, 0);
    }
} 