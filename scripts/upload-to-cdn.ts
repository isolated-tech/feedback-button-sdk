// AIDEV-NOTE: Script to upload button.js to Vercel Blob Storage
// This makes the feedback button available via CDN at https://cdn.pullreque.st/button.js

import { put } from '@vercel/blob'
import { readFileSync } from 'fs'
import { join } from 'path'

async function uploadButtonToCDN() {
    console.log('📦 Uploading button.js to Vercel Blob Storage...')

    // Check for required environment variable
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
        console.error('❌ Error: BLOB_READ_WRITE_TOKEN environment variable not set')
        console.error('')
        console.error('To get your token:')
        console.error('1. Go to https://vercel.com/dashboard')
        console.error('2. Select your project')
        console.error('3. Go to Storage → Create Database → Blob')
        console.error('4. Copy the BLOB_READ_WRITE_TOKEN')
        console.error('5. Add it to your .env.local file')
        console.error('')
        process.exit(1)
    }

    try {
        // Read the built UMD file
        const buttonPath = join(process.cwd(), 'dist/umd.js')
        const buttonContent = readFileSync(buttonPath, 'utf-8')

        // Upload to Vercel Blob with public access
        const blob = await put('cdn/button.js', buttonContent, {
            access: 'public',
            contentType: 'application/javascript',
            addRandomSuffix: false, // Keep the same URL
            allowOverwrite: true, // Allow updating existing file
        })

        console.log('✅ Upload successful!')
        console.log('')
        console.log('CDN URL:', blob.url)
        console.log('')
        console.log('You can now use this in your HTML:')
        console.log(`<script src="${blob.url}"></script>`)
        console.log('')
        console.log('For a custom domain (cdn.pullreque.st):')
        console.log('1. Go to Vercel Dashboard → Storage → Blob → Settings')
        console.log('2. Add custom domain: cdn.pullreque.st')
        console.log('3. Update your DNS with the provided CNAME')
        console.log('')
    } catch (error) {
        console.error('❌ Upload failed:', error)
        process.exit(1)
    }
}

uploadButtonToCDN()
