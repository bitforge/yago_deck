<template>
    <dialog class="demo-hint">
        <form method="dialog">
            <p>Not part of this demo (yet). 🥸😜</p>
            <button value="cancel">Continue</button>
        </form>
    </dialog>
</template>

<script>
export default {};
</script>

<style>
dialog.demo-hint {
    border-radius: 16px;
    border: 1px solid #ccc;
    box-shadow: 1px 1px 20px 1px #838383;
    font-size: 18px;
}

dialog.demo-hint button {
    width: 100%;
    font-size: 20px;
    font-weight: bold;
    background-color: #000;
    color: white;
    border-radius: 4px;
    border: none;
    padding: 12px;
}
</style>
