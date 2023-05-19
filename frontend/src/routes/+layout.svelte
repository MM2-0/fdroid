<script lang="ts">
	import type { PageData } from './$types'

	export let data: PageData
</script>

<svelte:head>
	<title>{data.repo.name}</title>
</svelte:head>
<slot />
