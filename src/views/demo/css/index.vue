<template>
  <div class="pg-css">
    <div class="ly-box">
      <CpCrumbs />
      <Time />
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
import Time from './time'

export default {
  components: {
    CpCrumbs,
    Flex,
    Baseline,
    Grid,
    Property,
    Time,
  },
}
</script>
