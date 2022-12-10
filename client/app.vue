<template>
  <div>
     <Form></Form>
  </div>
</template>
<script setup>
// Fix error ElementPlusError: [IdInjection]
import { ID_INJECTION_KEY } from 'element-plus'
provide(ID_INJECTION_KEY, {
  prefix: 100,
  current: 0,
})
</script>
