<script lang="ts">
	import 'material-symbols'
	import '../styles/index.scss'
	import type { PageData } from './$types'

	export let data: PageData
</script>

<main>
	<slot />
</main>

<style lang="scss">
	main {
		max-width: 800px;
		margin: 0 auto;
	}
</style>
