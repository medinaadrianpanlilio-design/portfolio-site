import { Document } from '@gltf-transform/core'
import { describe, expect, it } from 'vitest'

import { checkRoomNames, deriveRoomNames } from '../../scripts/room-lib.mjs'
import { requiredRoomNodes } from '../content/room'
import contract from '../content/roomContract.json'

describe('room build script', () => {
  it('script and app agree on the contract', () => {
    expect(deriveRoomNames(contract.objects)).toEqual(requiredRoomNodes())
  })

  it('reports missing names', () => {
    const document = new Document()
    const scene = document.createScene()
    for (const name of requiredRoomNodes().filter((name) => name !== 'window')) {
      scene.addChild(document.createNode(name))
    }

    expect(checkRoomNames(document, requiredRoomNodes())).toEqual(['window'])
  })

  it('finds nested nodes', () => {
    const document = new Document()
    const scene = document.createScene()
    const group = document.createNode('furniture')
    scene.addChild(group)
    for (const name of requiredRoomNodes()) {
      group.addChild(document.createNode(name))
    }

    expect(checkRoomNames(document, requiredRoomNodes())).toEqual([])
  })
})
