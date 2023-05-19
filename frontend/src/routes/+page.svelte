<script lang="ts">
	import type { PageData } from './$types'

	export let data: PageData
</script>

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

<style lang="scss">
	.title {
		width: 100%;
		height: 100vh;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 1rem;
		box-sizing: border-box;
		.card {
			max-width: 800px;
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
</style>
