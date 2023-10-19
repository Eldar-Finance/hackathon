multiversx_sc::imports!();
multiversx_sc::derive_imports!();

use core::ops::Deref;

#[multiversx_sc::module]
pub trait ViewsModule: crate::storage::StorageModule {

    //============================================================
    //
    // ************************ views ************************
    //
    //============================================================
    
    /// Returns the user's username, address, and secret words.
    #[view(getUserInfo)]
    fn get_user_info(&self, email: ManagedBuffer) -> MultiValueEncoded<ManagedBuffer> {
        let mut result: MultiValueEncoded<ManagedBuffer> = MultiValueEncoded::new();

        result.push(self.user_address(&email).get().as_managed_buffer().deref().clone());
        for word in self.user_secret_words(&email).iter() {
            result.push(word.clone());
        }

        return result;
    }
}
