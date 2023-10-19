multiversx_sc::imports!();
multiversx_sc::derive_imports!();

#[multiversx_sc::module]
pub trait StorageModule {

    #[view(users)]
    #[storage_mapper("users")]
    fn users(&self) -> UnorderedSetMapper<ManagedBuffer>;

    // #[view(user_address)]
    #[storage_mapper("user_address")]
    fn user_address(&self, email: &ManagedBuffer) -> SingleValueMapper<ManagedAddress>;

    // #[view(user_secret_words)]
    #[storage_mapper("user_secret_words")]
    fn user_secret_words(&self, email: &ManagedBuffer) -> VecMapper<ManagedBuffer>;
}
