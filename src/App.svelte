<script>
  import Header from "./UI/Header.svelte";
  import MeetupAddForm from "./Meetups/MeetupsAddForm.svelte";
  import MeetupGrid from "./Meetups/MeetupGrid.svelte";
  import meetups from "./Meetups/meetups-store";
  import MeetupDetail from "./Meetups/MeetupDetail.svelte";
  import { onMount } from "svelte";
  import { RingLoader } from "svelte-loading-spinners";
  import Error from "./UI/Error.svelte";

  let editMode = false;
  let editId = null;
  let isDetailsShown = false;
  let eventId = null;
  let isLoading = true;
  let isError = false;

  onMount(() => {
    fetch("https://svelte-app-7e70d.firebaseio.com/meetups.json")
      .then((res) => res.json())
      .then((data) => {
        const loadedMeetups = [];
        for (const key in data) {
          loadedMeetups.push({
            ...data[key],
            id: key,
          });
        }
        setTimeout(() => {
          isLoading = false;
          meetups.setMeetups(loadedMeetups.reverse());
        }, 2500);
      })
      .catch((e) => {
        isError = true;
        isLoading = false;
        console.log(e);
      });
  });

  function toggleModal() {
    editMode = !editMode;
    editId = null;
  }

  function setEditId(event) {
    editId = event.detail;
  }

  function showDetails(event) {
    isDetailsShown = !isDetailsShown;
    eventId = event.detail;
  }

  function closeError() {
    isError = false;
    isLoading = true
    fetch("https://svelte-app-7e70d.firebaseio.com/meetups.json")
      .then((res) => res.json())
      .then((data) => {
        const loadedMeetups = [];
        for (const key in data) {
          loadedMeetups.push({
            ...data[key],
            id: key,
          });
        }
        setTimeout(() => {
          isLoading = false;
          meetups.setMeetups(loadedMeetups.reverse());
        }, 2500);
      })
      .catch((e) => {
        isError = true;
        isLoading = false;
        console.log(e);
      });
  }
</script>

<style>
  main {
    margin-top: 5rem;
  }
  div {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 100px;
  }
</style>

{#if isError}
  <Error message="Something bad happened, try again later" on:toggleModal={closeError}/>
{/if}

<Header />
{#if isLoading}
  <div>
    <RingLoader size="300" color="#cf0056" unit="px" />
  </div>
{:else}
  <main>
    {#if isDetailsShown}
      <MeetupDetail id={eventId} on:showdetails={showDetails} />
    {:else}
      {#if editMode}
        <MeetupAddForm
          id={editId}
          on:toggleModal={toggleModal}
          on:setEditId={setEditId} />
      {/if}
      <MeetupGrid
        meetups={$meetups}
        on:showdetails={showDetails}
        on:edit={setEditId}
        on:toggleModal={toggleModal} />
    {/if}
  </main>
{/if}
