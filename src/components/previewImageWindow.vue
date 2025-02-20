<script setup>

import { ref,watch,defineEmits } from 'vue'

const props = defineProps({
    value: {
        type: Boolean,
        default: false
    },
    imgSrc: {
        type: String,
        default: null
    }
})

const imgSrc = ref(null);

const emits = defineEmits(['update:value'])

const closeWindow = () => {
    console.log("????");
    
    emits('update:value', false);
}
const apiUrl = import.meta.env.VITE_APP_BASE_API 

watch(() => props.value, (val) => {
  if(val){
    console.log('open')
    imgSrc.value = apiUrl + props.imgSrc
  }else{
    console.log('close')
  }
}, {deep: true})


</script>

<template>
    <div class="preview-img-cover" v-if="props.value">
        <div class="preview-img">
            <div class="close-btn" @click="closeWindow()"></div>
            <img :src="imgSrc" alt="preview image" />
        </div>
    </div>
</template>

<style lang="scss" scoped>
    .preview-img-cover{
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        z-index: 999;
        display: flex;
        justify-content: center;
        align-items: center;
        transition: 0.2s ease-in-out;
        .preview-img{
            position: relative;
            width: 100%;
            max-width: 600px;
            height: auto;
            min-height: 300px;
            background: #ffffff;
            border-radius: 8px;
            padding: 16px;
            .close-btn{
                position: absolute;
                z-index: 1;
                top: 0px;
                right: 0px;
                width: 32px;
                height: 32px;
                transition: 0.3s ease-in-out;
                &::before{
                    content: '';
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    width: 20px;
                    height: 2px;
                    background: #000;
                    transform: translate(-50%, -50%) rotate(45deg);
                }
                &::after{
                    content: '';
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    width: 20px;
                    height: 2px;
                    background: #000;
                    transform: translate(-50%, -50%) rotate(-45deg);
                }
                &:hover{
                    cursor: pointer;
                    transform: rotate(180deg);
                }
            }
            img{
                width: 100%;
                height: auto;
                border-radius: 16px;
            }
        }
    }
</style>