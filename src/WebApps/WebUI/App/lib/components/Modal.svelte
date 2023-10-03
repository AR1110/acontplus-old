<script>
    import { fade, fly } from "svelte/transition";
    import { quintOut } from "svelte/easing";
    export let open = false;
    // export let showBackdrop = true;
    export let onClosed;
    export let title;
    export let iconTitle;
    export let size = "";
    export let fullScreen = false;

    const modalClose = () => {
        open = false;
        if (onClosed) {
            onClosed();
        }
    };
</script>

<div
    id="modalNew"
    class="modal {fullScreen ? 'uibModalFullScreen' : ''}"
    tabindex="-1"
    role="dialog"
    aria-labelledby="sampleModalLabel"
    aria-hidden={false}
    in:fade={{ duration: 300 }}
    out:fade={{ duration: 300, easing: quintOut }}
>
    <div
        class="modal-dialog modal-dialog-centered {size ? size : ''}"
        role="document"
        in:fly={{ y: -50, duration: 300 }}
        out:fly={{ y: -50, duration: 300, easing: quintOut }}
    >
        <div class="modal-content">
            <div class="modal-header bg-success text-white">
                <h5 class="modal-title">
                    {#if iconTitle}
                        <i class={iconTitle} />
                    {/if}
                    {title}
                </h5>
                <button
                    type="button"
                    class="close"
                    data-dismiss="modal"
                    aria-label="Close"
                    on:click={() => modalClose()}
                >
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <slot />
        </div>
    </div>
</div>

<style>
    .modal {
        display: block;
        background: rgba(0, 0, 0, 0.5);
    }
</style>
