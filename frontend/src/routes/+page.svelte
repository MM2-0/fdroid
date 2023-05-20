<script lang="ts">
	import { goto } from '$app/navigation'
	import type { PageData } from './$types'

	export let data: PageData
</script>

<svelte:head>
	<title>{data.repo.name}</title>
</svelte:head>
<div class="top-section">
	<div class="space" />
	<div class="title">
		<div class="row">
			<img class="repo-icon" src={data.repo.icon} />
			<div class="column">
				<h1 class="display-large">{data.repo.name}</h1>
				<p>{data.repo.description}</p>
			</div>
		</div>
		<div class="card">
			<div class="column">
				<div class="title-large">Scan this code to add this repo your F-Droid client:</div>
				<div class="title-small">URL:</div>
				<div><a href={data.repo.url}>{data.repo.url}</a></div>
				<div class="title-small">Fingerprint:</div>
				<div>
					<tt class="fingerprint">
						{#each Array(data.repo.fingerprint.length / 2) as _, i}
							<span>{data.repo.fingerprint.substring(i * 2, i * 2 + 2)}</span>
						{/each}
					</tt>
				</div>
			</div>
			<img src={data.repo.qrCode} class="qr-code" />
		</div>
	</div>
	<div class="apps-title" id="apps-title">
		{#if data.apps.length}
			<h2 class="display-medium">
				Apps
				<span class="material-symbols-sharp" on:click={() => goto('#apps-title')}>
					arrow_downward
				</span>
			</h2>
		{/if}
	</div>
</div>
<div class="app-list-section">
	{#each data.apps as app}
		<div class="app card">
			<img src={app.icon} class="app-icon" />
			<div class="column">
				<a href="/app/{app.packageName}">
					<h3 class="title-large">{app.label}</h3>
				</a>
				<p class="body-medium">{app.summary}</p>
			</div>
		</div>
	{/each}
</div>

<style lang="scss">
	.title {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 1rem;
		box-sizing: border-box;
		.card {
			width: 100%;
			margin: 4rem;
			display: flex;
			flex-direction: row;
			row-gap: 1rem;
			a {
				color: var(--color-primary);
			}
			padding: 1rem;
			.column {
				.title-small {
					margin-top: 1rem;
				}
				flex-grow: 1;
			}
			.qr-code {
				width: 128px;
				height: 128px;
				align-self: center;
			}
		}
		.fingerprint {
			background-color: var(--color-primary-container);
			color: var(--color-on-primary-container);
			font-weight: 600;
			display: inline-flex;
			column-gap: 0.25rem;
			padding: 0.125rem 0.25rem;
			border-radius: var(--radius-small);
			flex-wrap: wrap;
		}
	}
	.row {
		display: flex;
		flex-direction: row;
		align-items: center;
		column-gap: 1rem;
	}
	.column {
		display: flex;
		flex-direction: column;
	}
	.repo-icon {
		width: 128px;
		height: 128px;
		margin-right: 2rem;
	}

	.top-section {
		height: 100vh;
		display: grid;
		grid-template-rows: 100px 1fr 100px;
		.apps-title {
			h2 {
				display: flex;
				width: 100%;
				justify-content: space-between;
				align-items: end;
				span {
					font-size: inherit;
					cursor: pointer;
					color: var(--color-primary);
					font-variation-settings: 'FILL' 0, 'wght' 700, 'GRAD' 0, 'opsz' 64;
				}
			}
		}
	}

	.app-list-section {
		display: flex;
		flex-direction: column;
		row-gap: 1rem;
		.card {
			padding: 1rem;
			display: flex;
			flex-direction: row;
			align-items: center;
			position: relative;
			h3,
			p {
				margin: 0;
			}
			.column {
				row-gap: 0.25rem;
			}

			a {
				color: inherit;
				text-decoration: none;
				&::before {
					content: '';
					position: absolute;
					top: 0;
					left: 0;
					width: 100%;
					height: 100%;
				}
			}
		}
		.app-icon {
			width: 64px;
			height: 64px;
			margin-right: 1rem;
		}
	}
</style>
