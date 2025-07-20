#[test_only]
module profile_contract::profile_tests {
    use std::signer;
    use profile_contract::profile::*;

    // Test addresses
    const TEST_ACCOUNT: address = @0x1;
    const TEST_ACCOUNT_2: address = @0x2;

    // Test data
    const TEST_DID: vector<u8> = b"did:iota:test:123456789";
    const TEST_NAME: vector<u8> = b"Test User";
    const TEST_EMAIL: vector<u8> = b"test@example.com";
    const TEST_WEBSITE: vector<u8> = b"https://example.com";
    const TEST_DESCRIPTION: vector<u8> = b"Test profile description";

    #[test]
    fun test_create_individual_profile() {
        let ctx = test_context::new_context(TEST_ACCOUNT);
        test_context::set_account(&mut ctx, TEST_ACCOUNT);

        // Create individual profile
        create_profile(
            &mut ctx,
            TEST_DID,
            PROFILE_TYPE_INDIVIDUAL,
            TEST_NAME,
            TEST_EMAIL,
            TEST_WEBSITE,
            TEST_DESCRIPTION,
            0, // Not used for individual
            0, // Not used for individual
        );

        // Verify profile was created
        let profile = get_profile_by_did(TEST_DID);
        assert!(profile.profile_type == PROFILE_TYPE_INDIVIDUAL, 0);
        assert!(profile.name == string::utf8(TEST_NAME), 0);
        assert!(profile.email == string::utf8(TEST_EMAIL), 0);
        assert!(profile.is_active, 0);
        assert!(profile.owner == TEST_ACCOUNT, 0);

        test_context::drop_context(ctx);
    }

    #[test]
    fun test_create_organization_profile() {
        let ctx = test_context::new_context(TEST_ACCOUNT);
        test_context::set_account(&mut ctx, TEST_ACCOUNT);

        // Create organization profile
        create_profile(
            &mut ctx,
            TEST_DID,
            PROFILE_TYPE_ORGANIZATION,
            TEST_NAME,
            TEST_EMAIL,
            TEST_WEBSITE,
            TEST_DESCRIPTION,
            ORG_TYPE_UNIVERSITY,
            0, // Not used for organization
        );

        // Verify profile was created
        let profile = get_profile_by_did(TEST_DID);
        assert!(profile.profile_type == PROFILE_TYPE_ORGANIZATION, 0);
        assert!(profile.organization_type == ORG_TYPE_UNIVERSITY, 0);
        assert!(profile.is_active, 0);

        test_context::drop_context(ctx);
    }

    #[test]
    fun test_create_government_profile() {
        let ctx = test_context::new_context(TEST_ACCOUNT);
        test_context::set_account(&mut ctx, TEST_ACCOUNT);

        // Create government profile
        create_profile(
            &mut ctx,
            TEST_DID,
            PROFILE_TYPE_GOVERNMENT,
            TEST_NAME,
            TEST_EMAIL,
            TEST_WEBSITE,
            TEST_DESCRIPTION,
            0, // Not used for government
            GOV_LEVEL_FEDERAL,
        );

        // Verify profile was created
        let profile = get_profile_by_did(TEST_DID);
        assert!(profile.profile_type == PROFILE_TYPE_GOVERNMENT, 0);
        assert!(profile.government_level == GOV_LEVEL_FEDERAL, 0);
        assert!(profile.is_active, 0);

        test_context::drop_context(ctx);
    }

    #[test]
    #[expected_failure(abort_code = E_PROFILE_ALREADY_EXISTS)]
    fun test_create_duplicate_profile() {
        let ctx = test_context::new_context(TEST_ACCOUNT);
        test_context::set_account(&mut ctx, TEST_ACCOUNT);

        // Create first profile
        create_profile(
            &mut ctx,
            TEST_DID,
            PROFILE_TYPE_INDIVIDUAL,
            TEST_NAME,
            TEST_EMAIL,
            TEST_WEBSITE,
            TEST_DESCRIPTION,
            0,
            0,
        );

        // Try to create duplicate profile
        create_profile(
            &mut ctx,
            TEST_DID,
            PROFILE_TYPE_INDIVIDUAL,
            TEST_NAME,
            TEST_EMAIL,
            TEST_WEBSITE,
            TEST_DESCRIPTION,
            0,
            0,
        );

        test_context::drop_context(ctx);
    }

    #[test]
    #[expected_failure(abort_code = E_INVALID_PROFILE_TYPE)]
    fun test_invalid_profile_type() {
        let ctx = test_context::new_context(TEST_ACCOUNT);
        test_context::set_account(&mut ctx, TEST_ACCOUNT);

        // Try to create profile with invalid type
        create_profile(
            &mut ctx,
            TEST_DID,
            99, // Invalid profile type
            TEST_NAME,
            TEST_EMAIL,
            TEST_WEBSITE,
            TEST_DESCRIPTION,
            0,
            0,
        );

        test_context::drop_context(ctx);
    }

    #[test]
    fun test_update_profile() {
        let ctx = test_context::new_context(TEST_ACCOUNT);
        test_context::set_account(&mut ctx, TEST_ACCOUNT);

        // Create profile
        create_profile(
            &mut ctx,
            TEST_DID,
            PROFILE_TYPE_INDIVIDUAL,
            TEST_NAME,
            TEST_EMAIL,
            TEST_WEBSITE,
            TEST_DESCRIPTION,
            0,
            0,
        );

        // Update profile
        let new_name = b"Updated Name";
        let new_email = b"updated@example.com";
        update_profile(
            &mut ctx,
            TEST_DID,
            new_name,
            new_email,
            TEST_WEBSITE,
            TEST_DESCRIPTION,
            0,
            0,
        );

        // Verify update
        let profile = get_profile_by_did(TEST_DID);
        assert!(profile.name == string::utf8(new_name), 0);
        assert!(profile.email == string::utf8(new_email), 0);

        test_context::drop_context(ctx);
    }

    #[test]
    #[expected_failure(abort_code = E_UNAUTHORIZED)]
    fun test_unauthorized_update() {
        let ctx = test_context::new_context(TEST_ACCOUNT);
        test_context::set_account(&mut ctx, TEST_ACCOUNT);

        // Create profile with TEST_ACCOUNT
        create_profile(
            &mut ctx,
            TEST_DID,
            PROFILE_TYPE_INDIVIDUAL,
            TEST_NAME,
            TEST_EMAIL,
            TEST_WEBSITE,
            TEST_DESCRIPTION,
            0,
            0,
        );

        // Try to update with different account
        test_context::set_account(&mut ctx, TEST_ACCOUNT_2);
        update_profile(
            &mut ctx,
            TEST_DID,
            TEST_NAME,
            TEST_EMAIL,
            TEST_WEBSITE,
            TEST_DESCRIPTION,
            0,
            0,
        );

        test_context::drop_context(ctx);
    }

    #[test]
    fun test_deactivate_and_reactivate_profile() {
        let ctx = test_context::new_context(TEST_ACCOUNT);
        test_context::set_account(&mut ctx, TEST_ACCOUNT);

        // Create profile
        create_profile(
            &mut ctx,
            TEST_DID,
            PROFILE_TYPE_INDIVIDUAL,
            TEST_NAME,
            TEST_EMAIL,
            TEST_WEBSITE,
            TEST_DESCRIPTION,
            0,
            0,
        );

        // Deactivate profile
        deactivate_profile(&mut ctx, TEST_DID);

        // Verify deactivation
        let profile_store = borrow_global<ProfileStore>(@profile_contract);
        let profile_key = *table::borrow(&profile_store.did_to_profile, string::utf8(TEST_DID));
        let profile = table::borrow(&profile_store.profiles, profile_key);
        assert!(!profile.is_active, 0);

        // Reactivate profile
        reactivate_profile(&mut ctx, TEST_DID);

        // Verify reactivation
        let profile = get_profile_by_did(TEST_DID);
        assert!(profile.is_active, 0);

        test_context::drop_context(ctx);
    }

    #[test]
    fun test_get_profiles_by_owner() {
        let ctx = test_context::new_context(TEST_ACCOUNT);
        test_context::set_account(&mut ctx, TEST_ACCOUNT);

        // Create multiple profiles
        let did1 = b"did:iota:test:111111111";
        let did2 = b"did:iota:test:222222222";

        create_profile(
            &mut ctx,
            did1,
            PROFILE_TYPE_INDIVIDUAL,
            TEST_NAME,
            TEST_EMAIL,
            TEST_WEBSITE,
            TEST_DESCRIPTION,
            0,
            0,
        );

        create_profile(
            &mut ctx,
            did2,
            PROFILE_TYPE_ORGANIZATION,
            TEST_NAME,
            TEST_EMAIL,
            TEST_WEBSITE,
            TEST_DESCRIPTION,
            ORG_TYPE_COMPANY,
            0,
        );

        // Get profiles by owner
        let profiles = get_profiles_by_owner(TEST_ACCOUNT);
        assert!(vector::length(&profiles) == 2, 0);

        test_context::drop_context(ctx);
    }

    #[test]
    fun test_get_total_profiles() {
        let ctx = test_context::new_context(TEST_ACCOUNT);
        test_context::set_account(&mut ctx, TEST_ACCOUNT);

        // Initial count should be 0
        assert!(get_total_profiles() == 0, 0);

        // Create profile
        create_profile(
            &mut ctx,
            TEST_DID,
            PROFILE_TYPE_INDIVIDUAL,
            TEST_NAME,
            TEST_EMAIL,
            TEST_WEBSITE,
            TEST_DESCRIPTION,
            0,
            0,
        );

        // Count should be 1
        assert!(get_total_profiles() == 1, 0);

        test_context::drop_context(ctx);
    }

    #[test]
    #[expected_failure(abort_code = E_INVALID_NAME)]
    fun test_invalid_name() {
        let ctx = test_context::new_context(TEST_ACCOUNT);
        test_context::set_account(&mut ctx, TEST_ACCOUNT);

        // Try to create profile with empty name
        create_profile(
            &mut ctx,
            TEST_DID,
            PROFILE_TYPE_INDIVIDUAL,
            b"", // Empty name
            TEST_EMAIL,
            TEST_WEBSITE,
            TEST_DESCRIPTION,
            0,
            0,
        );

        test_context::drop_context(ctx);
    }

    #[test]
    #[expected_failure(abort_code = E_INVALID_EMAIL)]
    fun test_invalid_email() {
        let ctx = test_context::new_context(TEST_ACCOUNT);
        test_context::set_account(&mut ctx, TEST_ACCOUNT);

        // Try to create profile with invalid email
        create_profile(
            &mut ctx,
            TEST_DID,
            PROFILE_TYPE_INDIVIDUAL,
            TEST_NAME,
            b"invalid-email", // Invalid email
            TEST_WEBSITE,
            TEST_DESCRIPTION,
            0,
            0,
        );

        test_context::drop_context(ctx);
    }
} 