import { writable } from 'svelte/store';

const meetups = writable([]);

const customMeetupsStore = {
  subscribe: meetups.subscribe,
  setMeetups: (data) => meetups.set(data),
  addMeetup: (meetupData) => {
    meetups.update(items => {
      return [meetupData, ...items]
    })
  },
  updateMeetup: (id, newMeetup) => {
    meetups.update(items => {
      const meetupIndex = items.findIndex(i => i.id === id)
      const updatedMeetup = { ...items[meetupIndex], ...newMeetup };
      const updatedMeetups = [...items];
      updatedMeetups[meetupIndex] = updatedMeetup;
      return updatedMeetups
    })
  },
  toggleFavorite: (id) => {
    meetups.update(items => {
      const updatedMeetup = { ...items.find((item) => item.id === id) };
      updatedMeetup.isFavorite = !updatedMeetup.isFavorite;
      const updatedMeetupIdx = items.findIndex((i) => i.id === id);
      const clonedMeetups = [...items];
      clonedMeetups[updatedMeetupIdx] = updatedMeetup;
      return clonedMeetups
    })
  },
  deleteMeetup: (id) => {
    meetups.update(items => {
      return items.filter(i => i.id !== id)
    })
  }
};

export default customMeetupsStore;