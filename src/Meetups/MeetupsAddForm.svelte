<script>
  import meetups from "./meetups-store";
  import TextInput from "../UI/TextInput.svelte";
  import Button from "../UI/Button.svelte";
  import { createEventDispatcher, onDestroy } from "svelte";
  import Modal from "../UI/Modal.svelte";
  import { isEmpty, isValidEmail } from "../helpers/validation";

  export let isFormIsValid = false;
  export let id = null;

  let newMeetup = {
    title: "",
    subtitle: "",
    description: "",
    imageUrl: "",
    address: "",
    contactEmail: "",
  };

  if (id) {
    const unsubscribe = meetups.subscribe((items) => {
      const selectedMeetup = items.find((i) => i.id === id);
      newMeetup = selectedMeetup;
    });
  }

  const dispatch = createEventDispatcher();

  function pepega() {
    if (id) {
      fetch(`https://svelte-app-7e70d.firebaseio.com/meetups/${id}.json`, {
        method: "PATCH",
        body: JSON.stringify(newMeetup),
        headers: { "Content-type": "application/json" },
      })
      .then(() => meetups.updateMeetup(id, newMeetup))
      dispatch("toggleModal");
    } else {
      fetch("https://svelte-app-7e70d.firebaseio.com/meetups.json", {
        method: "POST",
        body: JSON.stringify({ ...newMeetup, isFavorite: false }),
        headers: { "Content-type": "application/json" },
      })
        .then((res) => res.json())
        .then((data) =>
          meetups.addMeetup({ ...newMeetup, isFavorite: false, id: data.name })
        )
        .catch((e) => console.log(e));
      dispatch("toggleModal");
    }
  }

  function onCloseHandler() {
    dispatch("toggleModal");
  }

  $: isFormIsValid =
    isEmpty(newMeetup.title) &&
    isEmpty(newMeetup.subtitle) &&
    isEmpty(newMeetup.address) &&
    isEmpty(newMeetup.description) &&
    isEmpty(newMeetup.imageUrl) &&
    isValidEmail(newMeetup.contactEmail);

  console.log(id);
</script>

<style>
  form {
    width: 100%;
  }
</style>

<Modal title="Add new meetup" on:toggleModal>
  <form on:submit|preventDefault={pepega}>
    <TextInput
      label="Title"
      valid={isEmpty(newMeetup.title)}
      validityMessage="Title cant be empty"
      value={newMeetup.title}
      on:input={(event) => (newMeetup.title = event.target.value)} />
    <TextInput
      label="Subtitle"
      value={newMeetup.subtitle}
      validityMessage="Subtitle cant be empty"
      valid={isEmpty(newMeetup.subtitle)}
      on:input={(event) => (newMeetup.subtitle = event.target.value)} />
    <TextInput
      label="Address"
      validityMessage="Address cant be empty"
      value={newMeetup.address}
      valid={isEmpty(newMeetup.address)}
      on:input={(event) => (newMeetup.address = event.target.value)} />
    <TextInput
      label="Image URL"
      validityMessage="URL cant be empty"
      value={newMeetup.imageUrl}
      valid={isEmpty(newMeetup.imageUrl)}
      on:input={(event) => (newMeetup.imageUrl = event.target.value)} />
    <TextInput
      label="E-mail"
      validityMessage="Email is not valid"
      value={newMeetup.contactEmail}
      valid={isValidEmail(newMeetup.contactEmail)}
      inputType="email"
      on:input={(event) => (newMeetup.contactEmail = event.target.value)} />
    <TextInput
      label="Description"
      validityMessage="Description cant be empty"
      valid={isEmpty(newMeetup.description)}
      bind:value={newMeetup.description}
      controlType="textarea"
      rows="3" />
  </form>
  <div slot="footer">
    <Button type="button" mode="outline" on:click={onCloseHandler}>
      Close
    </Button>
    <Button type="button" on:click={pepega} disabled={!isFormIsValid}>
      {id ? 'Save changes' : 'Add meetup'}
    </Button>
  </div>
</Modal>
