<script lang="ts">
	import { CircleCheck, X, CircleX } from 'lucide-svelte';

	type fileWrapper = {
		file: File;
		isLoaded: boolean;
	};
	let files: fileWrapper[] = [];

	function onNewFileInput(event: Event) {
		const target = event.target as HTMLInputElement;
		files = [
			...files,
			...Array.from(target.files as FileList).map((file) => ({
				file: file,
				isLoaded: false
			}))
		];
	}

	function uploadHandler() {
		const promises: Promise<Response>[] = files.map((file, i) => {
			const formData = new FormData();
			formData.append('file', file.file);
			formData.append('index', i.toString());

			return fetch('/upload', {
				method: 'POST',
				body: formData
			});
		});

		Promise.all(promises)
			.then((responses) => Promise.all(responses.map((response) => responseHandler(response))))
			.then(() => {
				files = [...files];
			})
			.catch((error: Error) => console.error('Upload failed:', error));
	}

	async function responseHandler(response: Response) {
		if (response.status == 200) {
			const responseBody = await response.json();
			const id = responseBody.body;
			const file = files[id as number];
			file.isLoaded = true;
			console.log('Upload successful:', file.file.name);
		} else {
			const errorMessage = await response.text();
			console.error(`Upload failed: ${errorMessage}`);
		}
	}

	function removeHandler(file: File) {
		files = files.filter((f) => f.file !== file);
	}
</script>

<h1>Files</h1>

{#key files}
	<input class="file-input" type="file" multiple oninput={onNewFileInput} />
{/key}

<ul class="file-list">
	{#each files as file (file)}
		{@const _file = file.file}
		<li class="preview-file">
			<img
				class="preview-pic"
				src={URL.createObjectURL(_file)}
				alt={_file.name}
				title={_file.name}
			/>
			<span class="file-name">{_file.name}</span>
			{#if file.isLoaded}
				<CircleCheck color="green" />
			{:else}
				<CircleX color="gray" />
			{/if}
			<button class="remove-btn" onclick={() => removeHandler(_file)}><X color="red" /></button>
		</li>
	{/each}
</ul>
<button class="upload-btn" onclick={uploadHandler}>Upload</button>

<style>
	.file-list {
		list-style: none;
		padding: 0;
		margin: 0;
	}

	.preview-file {
		display: flex;
		align-items: center;
		margin-bottom: 10px;
	}

	.preview-pic {
		height: 50px;
		margin-right: 10px;
	}

	.file-name {
		font-size: 16px;
		margin-right: 10px;
	}

	.remove-btn {
		background-color: transparent;
		border: none;
		cursor: pointer;
	}

	.upload-btn {
		background-color: #85ac86;
		color: #fff;
		border: none;
		padding: 10px 20px;
		font-size: 16px;
		cursor: pointer;
		border-radius: 10px;
	}

	.upload-btn:hover {
		background-color: #587059;
	}

	.file-input {
		border: 1px solid #ccc;
		border-radius: 10px;
		padding: 10px;
		font-size: 16px;
		margin-bottom: 10px;
	}
</style>
