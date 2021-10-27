<template>
  <div class="webXrProjects">
    <h1>Projects</h1>
    <div v-for="(project, index) in projects" :key="index" class="projects">
      <h3>{{ project.name }}</h3>
      <button @click="showModel(index)">See Models</button>
      <div :v-if="showModelValues[index] == true" class="models">
        <WebXrModels :projectId="project.id"></WebXrModels>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import WebXrModels from "../Tryouts/WebXrModels.vue";
import { Configuration } from "@/api/runtime";
import { Component, Vue } from "vue-property-decorator";
import { AuthApi } from "@/api/apis/AuthApi";
import { ProjectsApi } from "@/api/apis/ProjectsApi";
import { Project } from "@/api";

@Component({
  components: {
    WebXrModels,
  },
})
export default class WebXrApi extends Vue {
  private apiKey = "bf51a81599630627c69dfb90561983627ef1e66f";
  private showModelValues: boolean[] = [];
  private projects: Project[] = [];
  private async mounted(): Promise<void> {
    try {
      const projectApi = new ProjectsApi(
        new Configuration({ apiKey: this.apiKey })
      );

      const projList = await projectApi.projectsList();

      this.updateProjects(projList);
    } catch (error: any) {
      console.log(error);
    }
  }

  private updateProjects(projList: Project[]): void {
    this.projects = projList;
    this.createShowModelValues(this.projects);
  }

  private createShowModelValues(projects: Project[]): void {
    for (var project in projects) {
      this.showModelValues.push(false);
    }
  }

  private showModel(index: number): void {
    console.log(index);
    if (this.showModelValues[index]) {
      this.showModelValues[index] = false;
      console.log(this.showModelValues[index]);
    } else {
      this.showModelValues[index] = true;
      console.log(this.showModelValues[index]);
    }
  }
}
</script>

<style scoped>
.projects {
  margin: 10px;
  padding: 20px;
  padding-bottom: 40px;
  border: solid 2px black;
  border-radius: 25px;
}
</style>
