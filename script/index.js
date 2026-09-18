import fs from "fs/promises";
import path from "path";
import * as OpenCC from "opencc-js";

// Define your folder paths
const INPUT_DIR = "./input";
const OUTPUT_DIR = "./output";

// Initialize the converter (Simplified Chinese to Traditional Chinese - Taiwan standard)
const convertToTraditional = OpenCC.ConverterFactory(
	OpenCC.Locale.from.cn,
	OpenCC.Locale.to.tw,
);

async function convertFolder() {
	try {
		// 1. Ensure the output folder exists
		await fs.mkdir(OUTPUT_DIR, { recursive: true });

		// 2. Read all files from the input folder
		const files = await fs.readdir(INPUT_DIR);

		if (files.length === 0) {
			console.log("No files found in the input folder.");
			return;
		}

		console.log(`Found ${files.length} files. Starting conversion...`);

		// 3. Process each file
		const conversionPromises = files.map(async (filename) => {
			const inputPath = path.join(INPUT_DIR, filename);
			const outputPath = path.join(OUTPUT_DIR, filename);

			// Check if it's a file (skip sub-folders)
			const stat = await fs.stat(inputPath);
			if (!stat.isFile()) return;

			// Read file content as string
			const rawContent = await fs.readFile(inputPath, "utf-8");

			// Convert content
			const convertedContent = convertToTraditional(rawContent);

			// Write content to the output folder
			await fs.writeFile(outputPath, convertedContent, "utf-8");
			console.log(`✅ Converted: ${filename}`);
		});

		// Wait for all conversions to complete simultaneously
		await Promise.all(conversionPromises);
		console.log(
			'\n🎉 All files successfully converted and saved to "./output"!',
		);
	} catch (error) {
		console.error("An error occurred during processing:", error.message);
	}
}

// Execute the function
convertFolder();
