#!/usr/bin/env tsx
/**
 * Import leadership profile photos from migration archive and link to Payload records.
 */
import 'dotenv/config'
import fs from 'fs'
import path from 'path'
import { getPayload } from 'payload'
import config from '../../src/payload.config'
import { MIGRATION_CONFIG } from '../../src/migration/config'
import { writeCsv } from '../../src/migration/csv'
import { guessMimeType } from '../../src/migration/media-utils'

const ARCHIVE_ROOT = path.join(MIGRATION_CONFIG.repoRoot, '.migration-work/uploads')

const LEADERSHIP_PHOTOS: Array<{ legacyPath: string; archivePath: string }> = [
  { legacyPath: '/o-home/leonardmckinlay/', archivePath: '2023/08/LeornardMcKinlay.jpg' },
  { legacyPath: '/o-home/bretttucker/', archivePath: '2023/11/Brett-Tucker.jpeg' },
  { legacyPath: '/o-home/michaelthompson/', archivePath: '2023/05/Michael-Thompson.jpg' },
  { legacyPath: '/o-home/serwaakankam/', archivePath: '2023/05/Serwaah-Kankam.jpg' },
  { legacyPath: '/o-home/edemscott/', archivePath: '2023/05/Edem-Scott.jpg' },
  { legacyPath: '/o-home/kevinopata/', archivePath: '2023/05/Kevin-Opata.jpg' },
  { legacyPath: '/o-home/stephenappiah/', archivePath: '2023/05/Stephen-Appiah-Fordjou.jpg' },
  { legacyPath: '/o-home/samuelpolley/', archivePath: '2023/10/Samuel-Polley.jpeg' },
  { legacyPath: '/o-home/mamadoukebe/', archivePath: '2023/10/Mamadou-KEBE.jpeg' },
  { legacyPath: '/o-home/senegal/baraawafall/', archivePath: '2023/10/Bara-Awa-Fall.jpeg' },
  { legacyPath: '/o-home/paulrichards/', archivePath: '2023/11/1615925299725.jpeg' },
  { legacyPath: '/home/eric-tenkorang/', archivePath: '2023/11/Brett-Tucker.jpeg' },
  { legacyPath: '/o-home/razak-awudulai1/', archivePath: 'elementor/thumbs/Razak-Awudulai-image-1-qr3xlv219cncl36bj3h3zrw4xj1c6hoiy12xu2qc40.jpg' },
  { legacyPath: '/o-home/samuel-osew-kwatia/', archivePath: '2025/06/Samuel-Osew-Kwatia.png' },
  { legacyPath: '/o-home/razak-awudulai/', archivePath: 'elementor/thumbs/Razak-Awudulai-image-1-qr3xlv219cncl36bj3h3zrw4xj1c6hoiy12xu2qc40.jpg' },
]

async function ensureMedia(payload: Awaited<ReturnType<typeof getPayload>>, filePath: string, uploadPath: string, alt: string) {
  const legacyKey = `leadership:${uploadPath}`
  const existing = await payload.find({
    collection: 'media',
    where: { 'legacy.originalUrl': { contains: path.basename(uploadPath) } },
    limit: 5,
  })

  const match = existing.docs.find((d) => d.legacy?.uploadPath === uploadPath || d.legacy?.originalUrl?.includes(path.basename(uploadPath)))
  if (match) return match.id

  const doc = await payload.create({
    collection: 'media',
    data: {
      alt,
      title: path.basename(uploadPath, path.extname(uploadPath)),
      legacy: {
        wordpressId: 0,
        originalUrl: `${MIGRATION_CONFIG.uploadsUrlPrefix}${uploadPath}`,
        uploadPath,
      },
    },
    filePath,
  })
  return doc.id
}

async function main() {
  const payload = await getPayload({ config })
  const rows: Record<string, unknown>[] = []

  for (const entry of LEADERSHIP_PHOTOS) {
    const filePath = path.join(ARCHIVE_ROOT, entry.archivePath)
    if (!fs.existsSync(filePath)) {
      rows.push({ legacy_path: entry.legacyPath, status: 'file_missing', archive: entry.archivePath })
      continue
    }

    const person = await payload.find({
      collection: 'leadership',
      where: { 'legacy.legacyPath': { equals: entry.legacyPath } },
      limit: 1,
    })

    if (!person.docs[0]) {
      rows.push({ legacy_path: entry.legacyPath, status: 'person_missing', archive: entry.archivePath })
      continue
    }

    const name = person.docs[0].name
    const mime = guessMimeType(filePath)
    if (!mime.startsWith('image/')) {
      rows.push({ legacy_path: entry.legacyPath, status: 'not_image', archive: entry.archivePath })
      continue
    }

    const photoId = await ensureMedia(payload, filePath, entry.archivePath, `${name} — Onix leadership`)
    await payload.update({
      collection: 'leadership',
      id: person.docs[0].id,
      data: { photo: photoId },
    })

    rows.push({ legacy_path: entry.legacyPath, name, status: 'linked', photo_id: photoId, archive: entry.archivePath })
  }

  writeCsv(path.join(MIGRATION_CONFIG.reportsDir, 'leadership-photos.csv'), rows)
  const linked = rows.filter((r) => r.status === 'linked').length
  console.log(`Linked ${linked}/${LEADERSHIP_PHOTOS.length} leadership photos`)
  if (rows.some((r) => r.status !== 'linked')) {
    console.log('Issues:', rows.filter((r) => r.status !== 'linked'))
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
