<script lang="ts">
	import type { PageData } from './$types'

	export let data: PageData
</script>

<div class="title">
	<img src={data.app.icon} class="app-icon" />
	<div class="column">
		<h1 class="headline-large">{data.app.label}</h1>
		<p class="body-large">{data.app.summary}</p>
	</div>
</div>
<div class="details">
	{#if data.app.description}
		<div class="card">
			<p class="body-medium">{data.app.description}</p>
		</div>
	{/if}
	{#if data.app.versions.length}
		<div class="card downloads">
			<h2 class="headline-medium">Downloads</h2>
			{#each data.app.versions as version}
				<div class="version">
					<div class="text">
						<div class="name title-medium">{version.name}</div>
						<div class="release-date body-medium">
							Released on {new Date(version.releaseDate).toLocaleDateString()}
						</div>
					</div>
					<a href={version.download} class="button">
						<span class="material-symbols-sharp">download</span>
					</a>
				</div>
			{/each}
		</div>
	{/if}
</div>

<style lang="scss">
	.title {
		padding: 3rem 0;
		display: flex;
		align-items: center;
		column-gap: 1rem;
		.app-icon {
			width: 128px;
			height: 128px;
		}
		.column {
			flex-grow: 1;
			row-gap: 0.25rem;
		}
	}

	.column {
		display: flex;
		flex-direction: column;
	}
	.details {
		display: flex;
		flex-direction: column;
		row-gap: 1rem;
		.card {
			padding: 1rem;
		}
	}

	.downloads {
		display: flex;
		flex-direction: column;
		row-gap: 1rem;
		.version {
			position: relative;
			display: flex;
			align-items: end;
			justify-content: space-between;
			&:not(:last-child) {
				&::after {
					content: '';
					position: absolute;
					bottom: calc(-0.5rem - 0.5px);
					height: 1px;
					width: 100%;
					background-color: var(--color-outline-variant);
				}
			}
			a {
				color: var(--color-primary);
			}
		}
	}

	h1,
	h2,
	p {
		margin: 0;
	}
</style>
