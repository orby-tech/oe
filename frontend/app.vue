<script lang="ts" setup>
import './assets/less/app.less';
import 'vue-final-modal/style.css';
import 'virtual:svg-icons-register';
import { useLocationStore } from './stores/location.store';
import { ModalsContainer } from 'vue-final-modal';

const { $translate } = useNuxtApp();

useHead({
	//TODO доработать метаданные
	title: $translate('meta.title'),
	meta: [{ name: 'Афиша переделано', content: 'Это площадка для поиска мероприятий' }]
});
const { data } = await apiRouter.location.getUserLocation.useQuery();
await useLocationStore().init(data.value ?? {});
</script>
<template>
	<HeaderCommon />
	<main class="main">
		<ModalsContainer />
		<NuxtPage />
	</main>
</template>

<style lang="less" scoped>
.main {
	height: 100%;
	padding-top: var(--header-height);
}
</style>
