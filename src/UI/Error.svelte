<script>
  import Modal from './Modal.svelte';
  export let message;
</script>

<Modal title="Error occurred!" on:toggleModal>
  <p>{message}</p>
</Modal>