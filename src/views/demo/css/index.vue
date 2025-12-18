<template>
  <div class="pg-css">
    <div class="ly-box">
      <CpCrumbs />
      <Flex />
      <Baseline />
      <Grid />
      <Property />
    </div>
  </div>
</template>
<script>
import CpCrumbs from '@/components/crumbs/'
import Flex from './flex'
import Property from './property'
import Baseline from './baseline'
import Grid from './grid'

export default {
  components: {
    CpCrumbs,
    Flex,
    Baseline,
    Grid,
    Property,
  },
}
</script>
