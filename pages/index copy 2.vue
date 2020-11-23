<template>
  
      <v-card class="mx-auto"
  
    dark
    max-width="2000">
        <v-card-title class="headline">
          Thermal Detection
        </v-card-title>
        <v-card-text>          
          <hr class="my-3">
          <v-timeline
            align-top
            dense
          >
            <v-timeline-item
              v-for="message in messages"
              :key="message.time"
              :color="message.color"
              small
            >
              <div>
                <div class="font-weight-normal">
                  <strong>{{ message.category }}</strong> 
                </div>
                <div>{{ message.value }}</div>
              </div>
            </v-timeline-item>
          </v-timeline>
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
   data: () => ({
      messages: [
        {
          category: 'Thermal (Estimate)',
          value: `37,4 C`,         
           color: 'white',
        },
        {
          category: 'Status',        
          value: 'Normal',
          color: 'white',
        },
       
      ],
    }),
  components: {
    Logo,
    VuetifyLogo
  }
}
</script>
