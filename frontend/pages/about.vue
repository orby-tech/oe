<script setup lang="ts">
import eventScreen from '@/assets/img/event-screen@2x.png';
import { REPO_URL } from '@/constants/url';

const { $translate } = useNuxtApp();

useHead({
	title: `${$translate('meta.title')} / ${$translate('meta.about_us.title')}`
});
</script>

<template>
	<section class="about">
		<h2 class="title">{{ $translate('about.title') }}</h2>
		<img
			:src="eventScreen"
			class="about__img"
			:alt="$translate('about.alt')"
		/>
		<p>{{ $translate('about.idea') }}</p>
		<br />
		<p>{{ $translate('about.functionality') }}</p>
		<br />
		<p>{{ $translate('about.monetization') }}</p>
		<br />
		<p>
			{{ $translate('about.github') }}:
			<NuxtLink
				:href="REPO_URL"
				class="about__link"
				target="_blank"
				rel="noopener noreferrer"
			>
				Repo
			</NuxtLink>
		</p>
	</section>
</template>

<style lang="less" scoped>
.about {
	padding-left: var(--padding-side);
	padding-right: var(--padding-side);
	padding-top: var(--padding-vertical);
	padding-bottom: var(--padding-vertical);
}

.about p {
	font-size: var(--font-size-S);
	line-height: 20px;
}

.title {
	font-size: var(--font-size-XXL);
	line-height: var(--line-height-XXL);
	font-weight: var(--font-weight-bold);
}

.about__img {
	width: 100%;
	min-width: 100%;
	max-width: 100%;
	height: 100%;
	margin-top: var(--space-unrelated-items);
	margin-bottom: var(--space-related-items);
	border-radius: 4px;
}

.about__link {
	color: var(--color-link);
	text-decoration: underline;
	font-weight: var(--font-weight-bold);
}
</style>
