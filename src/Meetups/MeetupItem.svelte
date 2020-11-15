<script>
  import { createEventDispatcher } from "svelte";
  import meetups from "./meetups-store";
  import Badge from "../UI/Badge.svelte";
  import Button from "../UI/Button.svelte";
  export let meetup;
  import { RingLoader } from 'svelte-loading-spinners';

  let isLoading = false

  function toggleFavoritHandler() {
    isLoading = true
    fetch(`https://svelte-app-7e70d.firebaseio.com/meetups/${meetup.id}.json`, {
      method: "PATCH",
        body: JSON.stringify({isFavorite: !meetup.isFavorite}),
        headers: { "Content-type": "application/json" },
    })
    .then(() => {
      meetups.toggleFavorite(meetup.id)
      isLoading = false
    })
    .catch(e => {
      isLoading = false
      console.log(e)
    })
  }
  const dispatch = createEventDispatcher();

  function pepo() {
    dispatch('toggleModal')
    dispatch('edit', meetup.id)
  }

  function deleteMeetupHandler() {
    fetch(`https://svelte-app-7e70d.firebaseio.com/meetups/${meetup.id}.json`, {
      method: "DELETE",
        body: JSON.stringify({isFavorite: !meetup.isFavorite}),
        headers: { "Content-type": "application/json" },
    })
    .then(() => meetups.deleteMeetup(meetup.id))
    .catch(e => console.log(e))
    
  }
</script>

<style>
  article {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.26);
    border-radius: 5px;
    background: white;
    margin: 1rem;
  }

  header,
  .content,
  footer {
    padding: 1rem;
  }

  .image {
    width: 100%;
    height: 25rem;
  }

  .image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  h1 {
    font-size: 1.25rem;
    margin: 0.5rem 0;
    font-family: "Roboto Slab", sans-serif;
  }

  h1.is-favorite {
    background: #01a129;
    color: white;
    padding: 0 0.5rem;
    border-radius: 5px;
  }

  h2 {
    font-size: 1rem;
    color: #808080;
    margin: 0.5rem 0;
  }

  p {
    font-size: 1.25rem;
    margin: 0;
  }

  div {
    text-align: right;
  }
  .link {
    text-decoration: none;
    color: inherit;
    margin-right: 5px;
  }
</style>

<article>
  <header>
    <h1>
      {meetup.title}
      {#if meetup.isFavorite}
        <Badge>Favorite</Badge>
      {/if}
    </h1>
    <h2>{meetup.subtitle}</h2>
    <p>{meetup.address}</p>
  </header>
  <div class="image"><img src={meetup.imageUrl} alt={meetup.title} /></div>
  <div class="content">
    <p>{meetup.description}</p>
  </div>
  <footer>
    <Button
      mode="outline"
      type="button"
      on:click={pepo}>
      Edit
    </Button>
    <Button on:click={() => dispatch('showdetails', meetup.id)}>
      Show details
    </Button>
    <Button
      mode="outline"
      color={meetup.isFavorite ? null : 'success'}
      on:click={toggleFavoritHandler}
      disabled={isLoading}>
      {meetup.isFavorite ? 'Unfavorite' : 'Favorite'}
    </Button>
    <Button type="button" on:click={deleteMeetupHandler}>
      Delete
    </Button>
  </footer>
</article>
