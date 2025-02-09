<script setup lang="ts">
import { RouteNameEnum } from '@/constants/enums/route';
import { computed } from 'vue';
import { type UseModalOptions, VueFinalModal, useModal } from 'vue-final-modal';
import NeedAuthorize from '~/components/modal/NeedAuthorize.vue';
import { useLocationStore } from '~/stores/location.store';
import EventModal from '../components/modal/Event.vue';
const { $translate } = useNuxtApp();
useHead({ titleTemplate: `%s / ${$translate('meta.home.title')}` });
definePageMeta({ name: RouteNameEnum.HOME });

const {
	open: openEventModal,
	close: closeEventModal,
	patchOptions: eventModalPatch
} = useModal({ component: EventModal } as UseModalOptions<
	InstanceType<typeof VueFinalModal>['$props']
>);
eventModalPatch({ attrs: { closeEventModal } });
const {
	open: openNeedAuthorizeModal,
	close: closeNeedAuthorizeModal,
	patchOptions: needAuthorizeModalPatch
} = useModal({ component: NeedAuthorize } as UseModalOptions<
	InstanceType<typeof VueFinalModal>['$props']
>);
needAuthorizeModalPatch({ attrs: { closeNeedAuthorizeModal } });

const locationStore = useLocationStore();

const route = useRoute();
const search = ref(route.query.search?.toString() ?? '');
const debouncedEventsRequestQuery = refDebounced(
	computed(() => ({
		city: locationStore.pickedCity,
		country: locationStore.pickedCountry,
		searchLine: search.value
	})),
	500,
	{ maxWait: 5000 }
);
const { data: posterEvents } = await apiRouter.events.findMany.useQuery({
	query: debouncedEventsRequestQuery
});

const onButtonClick = () => {
	if (useCookie('token').value) {
		openEventModal();
	} else {
		openNeedAuthorizeModal();
	}
};
const now = Date.now();
</script>

<template>
	<div class="main-page">
		<HomeSearch
			v-model:search="search"
			class="main-page__search"
		/>
		<div class="main-page__location">
			<HomeUserLocation />
		</div>
		<h1 class="main-page__title">
			{{ $translate('home.title') }}
		</h1>
		<HomeFilter class="main-page__filter" />

		<ul class="main-page__card-list">
			<li
				v-for="event in posterEvents"
				:key="event.id"
			>
				<HomeEventPreviewCard
					:class="{ expired: event.date < now }"
					:event-data="event"
				/>
				<!-- <HomeAdCard v-else :ad-data="event" class="ad-block" /> -->
			</li>
		</ul>

		<CommonButton
			class="add-event-button"
			button-kind="success"
			is-round
			icon-name="plus"
			:alt="$translate('home.button.add_event_aria')"
			aria-haspopup="true"
			@click="onButtonClick"
		/>
	</div>
</template>

<style lang="less" scoped>
.main-page {
	padding-top: 16px;

	&__search {
		padding-left: var(--padding-side);
		padding-right: var(--padding-side);
		margin-bottom: 40px;
	}

	&__location {
		display: flex;
		width: 100%;
		padding-left: var(--padding-side);
		padding-right: var(--padding-side);
		margin-bottom: 16px;
	}

	&__title {
		font-size: var(--font-size-XXL);
		line-height: 40px;
		padding-left: var(--padding-side);
		padding-right: var(--padding-side);
		margin-bottom: 24px;
	}

	&__filter {
		padding-left: var(--padding-side);
		padding-right: var(--padding-side);
		margin-bottom: 24px;
	}

	&__card-list {
		display: flex;
		flex-direction: column;
		width: 100%;
	}
}

.add-event-button {
	position: sticky;
	bottom: 20px;
	right: 0;
	margin-left: auto;
	margin-right: 20px;
	z-index: 1;
}

.expired {
	opacity: 0.5;
}
</style>
