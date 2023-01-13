<template>
  <q-layout view="hHh Lpr fFf">
    <q-header elevated>
      <q-toolbar>
        <q-toolbar-title>
          Quasar App
        </q-toolbar-title>

        <div>Quasar v{{ $q.version }}</div>
      </q-toolbar>
    </q-header>


    <q-page-container>
      <router-view />
    </q-page-container>
    <q-footer>
      <q-toolbar>
        <q-space />
        <q-separator vertical />
        <q-btn dense flat icon="person" class="q-mx-sm" type="a" target="_blank" href="https://medium.com/@dalotodo">View Profile</q-btn>
        <q-btn dense flat icon="code" class="q-mx-sm" type="a" target="_blank" href="https://quasar.dev">Made with Quasar</q-btn>
      </q-toolbar>
    </q-footer>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue';




const leftDrawerOpen = ref(false)

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}
</script>
