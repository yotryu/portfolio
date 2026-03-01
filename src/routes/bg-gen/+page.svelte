<script lang="ts">
	// import ggw_1 from '$lib/assets/ggw_1.png';
	// import ggw_2 from '$lib/assets/ggw_2.png';
	// import ggw_3 from '$lib/assets/ggw_3.png';
	// import lw_1 from '$lib/assets/lw_1.png';
	// import lw_2 from '$lib/assets/lw_2.png';
	// import lw_3 from '$lib/assets/lw_3.png';
	// import rls_1 from '$lib/assets/rls_1.png';
	// import rls_2 from '$lib/assets/rls_2.png';
	// import rls_3 from '$lib/assets/rls_3.png';
	// import rls_4 from '$lib/assets/rls_4.png';
	// import rls_5 from '$lib/assets/rls_5.png';
	// import cf_bg_1 from '$lib/assets/cf_bg_1.png';
	// import cf_bg_2 from '$lib/assets/cf_bg_2.png';
	// import cf_bg_3 from '$lib/assets/cf_bg_3.png';
	// import cf_bg_4 from '$lib/assets/cf_bg_4.png';
	// import ps_bg_1 from '$lib/assets/ps_bg_1.png';
	// import ps_bg_2 from '$lib/assets/ps_bg_2.png';
	// import ps_bg_3 from '$lib/assets/ps_bg_3.png';
	// import ps_bg_4 from '$lib/assets/ps_bg_4.png';
	// import ps_bg_5 from '$lib/assets/ps_bg_5.png';

	function getShuffledArray(arr: any[])
	{
		let result = [...arr];

		for (var i = result.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = result[i];
            result[i] = result[j];
            result[j] = temp;
        }

		return result;
	}

	const rows: string[][] = [];
	// const baseImages = [ggw_1, ggw_2, ggw_3, lw_1, lw_2, lw_3, rls_1, rls_2, rls_3, rls_4, rls_5, cf_bg_1, cf_bg_2, cf_bg_3, cf_bg_4, ps_bg_1, ps_bg_2, ps_bg_3, ps_bg_4];
	// const rows: string[][] = [];
	// let availableImages = getShuffledArray(baseImages);
	// let lastShuffle = [...availableImages];

	// for (let i = 0; i < 6; ++i)
	// {
	// 	if (availableImages.length < 5)
	// 	{
	// 		availableImages = getShuffledArray(lastShuffle);
	// 		lastShuffle = [...availableImages];
	// 	}

	// 	rows.push(availableImages.splice(0, 5));
	// }
</script>

<div class="outer-container">
	<div class="bg-container">
		<div class="bg-transform">
			{#each rows as rowImages, index}
				{@const rowClass = index % 2 == 0 ? "bg-row" : "bg-row-opposite"}
				<div class={rowClass}>
					{#each rowImages as image}
						<img class="bg-image" src={image} alt=""/>
					{/each}
					{#each rowImages as image}
						<img class="bg-image" src={image} alt=""/>
					{/each}
					{#each rowImages as image}
						<img class="bg-image" src={image} alt=""/>
					{/each}
				</div>
			{/each}
		</div>
	</div>
</div>


<style>
	.outer-container {
		display: grid;
		place-items: center;
		overflow: hidden;
		margin-top: 3.5em;
	}

	.bg-container {
		z-index: -1;
		position: absolute;
		left: 0;
		top: 0;
		right: 0;
		bottom: 0;
		overflow: hidden;
	}

	.bg-transform {
		/* filter: brightness(50%); */
		rotate: -10deg;
		scale: 130%;
	}

	@keyframes moveRow {
		from {transform: translateX(-1200px);}
		to {transform: translateX(0px);}
	}

	.bg-row, .bg-row-opposite {
		display: flex;
		animation: moveRow 30s linear 0s infinite normal;
	}

	.bg-row-opposite {
		animation: moveRow 30s linear 0s infinite reverse;
	}

	.bg-image {
		min-width: 232px;
		height: 135px;
		object-fit: cover;
		margin: 4px;
		border-radius: 12px;
	}
</style>
