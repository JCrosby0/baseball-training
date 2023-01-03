<template>
  <div class="slider-container">

    <slot name="before"></slot>
    <label class="switch" @change="toggle">
      <input type="checkbox" :value="status">
      <span :class="{ slider: true, round: rounded }"></span>
    </label>
    <slot name="after"></slot>
  </div>
</template>

<script setup>
const props = defineProps({
  status: Boolean,
  rounded: Boolean,
})

const emit = defineEmits(['toggle'])
const toggle = () => {
  emit('toggle')
}

</script>
<style scoped>
.before,
.after {
  opacity: 20%;
  line-height: 20px;
  font-size: x-large;
}

/* The switch - the box around the slider */
.slider-container {
  gap: 4px;
  display: flex;
  flex: row;
  justify-content: center;
  align-items: top;
  border: 0;
  outline: 0;
}

.switch {
  position: relative;
  display: inline-block;
  width: 40px;
  height: 20px;
  box-sizing: border-box;
}

/* Hide default HTML checkbox */
.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

/* The slider */
.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  -webkit-transition: .3s;
  transition: .3s;
}

.slider:before {
  position: absolute;
  content: "";
  height: 14px;
  width: 14px;
  left: 3px;
  top: 3px;
  background-color: rgba(255 255 255/.5);
  -webkit-transition: .3s;
  transition: .3s;
}

input:checked+.slider {
  background-color: rgba(128 128 255 / .5);
}

/* input:focus+.slider {
  box-shadow: 0 0 1px #2196F3;
} */

input:checked+.slider:before {
  -webkit-transform: translateX(20px);
  -ms-transform: translateX(20px);
  transform: translateX(20px);
}

/* Rounded sliders */
.slider.round {
  border-radius: 20px;
}

.slider.round:before {
  border-radius: 50%;
}
</style>