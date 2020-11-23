<template>
  
      <v-card class="mx-auto"
    color="#26c6da"
    dark
    max-width="2000">
        <v-card-title class="headline">
          Thermal Detection
        </v-card-title>
        <v-card-text>
          
          <hr class="my-3">
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn           
            nuxt
            to="/About"
          >
            About
          </v-btn>
        </v-card-actions>
      </v-card>
</template>

<script>
import Logo from '~/components/Logo.vue'
import VuetifyLogo from '~/components/VuetifyLogo.vue'

export default {
  components: {
    Logo,
    VuetifyLogo
  }
}
</script>
