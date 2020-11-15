<script>
  import {createEventDispatcher} from 'svelte';
  import MeetupItem from './MeetupItem.svelte';
  import MeetupFilter from './MeetupFilter.svelte';
  import Button from "../UI/Button.svelte";
  import { scale } from 'svelte/transition';
  import { flip } from 'svelte/animate';
  export let meetups;

  const dispatch = createEventDispatcher();
  let filterMode = false;

  function setFilterMode(event) {
    filterMode = event.detail
  }

  $: filteredMeetups = filterMode ? meetups.filter(i => i.isFavorite) : meetups;

</script>
<style>
  #meetups {
    width: 100%;
    display: grid;
    grid-template-columns: 1fr;
    grid-gap: 1rem;
  }

  #meetups-filter {
    margin: 1rem;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }

  @media (min-width: 768px) {
    #meetups{
      grid-template-columns: repeat(2, 1fr);
    }
  }
</style>

<section id="meetups-filter">
  <MeetupFilter on:setFilterMode={setFilterMode} {filterMode} />
  <Button on:click={() => dispatch('toggleModal')}>
    Add new event
  </Button>
</section>
<section id="meetups">
  {#each filteredMeetups as meetup (meetup.id)}
  <div transition:scale animate:flip>
    <MeetupItem {meetup} on:showdetails on:edit on:toggleModal />
  </div>
  {/each}
</section>