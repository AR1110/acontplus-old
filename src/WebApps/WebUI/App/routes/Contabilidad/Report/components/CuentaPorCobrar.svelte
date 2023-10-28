<script>
    import { onMount } from 'svelte';
    import flatpickr from 'flatpickr';
    import 'flatpickr/dist/flatpickr.css';
  
    let selectedDates = [];
  
    onMount(() => {
      const datepicker = flatpickr('#daterange', {
        mode: 'range',
        dateFormat: 'Y-m-d', // Customize the date format as needed
        onChange: (selectedDates) => {
          selectedDates = selectedDates;
        },
      });
    });
  </script>
  
  <div>
    <input type="text" id="daterange" placeholder="Select a date range" />
  </div>
  
  {#if selectedDates.length > 0}
    <p>Selected Date Range: {selectedDates[0]} to {selectedDates[1]}</p>
  {/if}