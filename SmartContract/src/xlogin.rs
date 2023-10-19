#![no_std]

multiversx_sc::imports!();
multiversx_sc::derive_imports!();

mod storage;
mod views;

use core::ops::Deref;

#[multiversx_sc::contract]
pub trait XLogin:
    storage::StorageModule
    + views::ViewsModule
{
    //============================================================
    //
    // ************************ init ************************
    //
    //============================================================

    #[init]
    fn init(&self) {
    }

    //============================================================
    //
    // ********************* owner endpoints *********************
    //
    //============================================================

    // #[only_owner]
    #[endpoint(createUser)]
    fn create_user(&self, email: ManagedBuffer, address: ManagedAddress, secret_words_encrypted: MultiValueEncoded<ManagedBuffer>) {
        self.only_for_owners();

        require!(
            !self.users().contains(&email),
            "User already exists."
        );
    
        self.users().insert(email.clone());
        self.user_address(&email).set(address);
        for word in secret_words_encrypted.into_iter() {
            self.user_secret_words(&email).push(&word);
        }
    }

    // #[only_owner]
    #[endpoint(clearUser)]
    fn clear_user(&self, email: ManagedBuffer) {
        let caller = self.blockchain().get_caller();
        let user_address = self.user_address(&email).get();

        if caller != user_address {
            self.only_for_owners();
        }

        require!(
            self.users().contains(&email),
            "User does not exist."
        );

        self.users().swap_remove(&email);
        self.user_address(&email).clear();
        self.user_secret_words(&email).clear();
    }

    //============================================================
    //
    // ********************* Relayer *********************
    //
    //============================================================

    #[view(withOwnerRights)]
    #[storage_mapper("with_owner_rights")]
    fn with_owner_rights(&self) -> UnorderedSetMapper<ManagedAddress>;

    #[only_owner]
    #[endpoint(addOwnerRights)]
    fn add_owner_rights(&self, addresses: MultiValueManagedVec<ManagedAddress>) {
        for address in addresses.into_vec().iter() {
            self.with_owner_rights().insert(address.deref().clone());
        }
    }

    #[only_owner]
    #[endpoint(removeOwnerRights)]
    fn remove_owner_rights(&self, addresses: MultiValueManagedVec<ManagedAddress>) {
        for address in addresses.into_vec().iter() {
            self.with_owner_rights().swap_remove(&address);
        }
    }

    fn only_for_owners(&self) {
        let caller = self.blockchain().get_caller();
        let owner = self.blockchain().get_owner_address();

        require!(
            caller == owner || self.with_owner_rights().contains(&caller),
            "This endpoint is called only by the owners."
        );
    }
}
