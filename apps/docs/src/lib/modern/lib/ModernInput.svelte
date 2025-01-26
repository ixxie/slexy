<script lang="ts">
  let { value = $bindable(), ...rest } = $props();
</script>

<input bind:value {...rest} />

<style>
  input {
    border-radius: 1rem;
    border: none;
    outline: none;
    padding: 0 1rem;
    font-size: smaller;
    color: var(--slex-link-color);
  }
</style>
