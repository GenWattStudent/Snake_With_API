import { ref } from "vue";

export default function useModal() {
    const isModalOpen = ref(false);

    function open() {   
        isModalOpen.value = true;
    }

    function close() {
        isModalOpen.value = false;
    }

    return { isModalOpen, open, close }
}