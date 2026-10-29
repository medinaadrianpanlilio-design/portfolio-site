import { describe, expect, it } from 'vitest'

import { ROOM_OBJECTS, requiredRoomNodes } from '../../../content/room'
import { getRoomMode } from '../roomMode'

describe('getRoomMode', () => {
  it('defaults to the stand-in in dev and off in production', () => {
    expect(getRoomMode({ DEV: true })).toBe('standin')
    expect(getRoomMode({ DEV: false })).toBe('off')
  })

  it('lets a valid VITE_ROOM win', () => {
    expect(getRoomMode({ DEV: false, VITE_ROOM: 'model' })).toBe('model')
    expect(getRoomMode({ DEV: true, VITE_ROOM: 'off' })).toBe('off')
  })

  it('treats an unknown VITE_ROOM as off', () => {
    expect(getRoomMode({ DEV: false, VITE_ROOM: 'bogus' })).toBe('off')
  })
})

describe('room contract', () => {
  it('requires every object, its camera spot and the start view', () => {
    const nodes = requiredRoomNodes()
    expect(nodes).toHaveLength(17)
    expect(nodes).toContain('cam_start')
    expect(nodes).toContain('cam_start_target')
    expect(nodes).toContain('cam_resume_paper_target')
    for (const object of ROOM_OBJECTS) {
      expect(nodes).toContain(object.name)
      expect(nodes).toContain(`cam_${object.name}`)
    }
  })

  it('maps each object to an existing page', () => {
    expect(ROOM_OBJECTS.map((object) => [object.name, object.to])).toEqual([
      ['monitor', '/projects'],
      ['system_unit', '/#skills'],
      ['window', '/#contact'],
      ['bed', '/about'],
      ['resume_paper', '/Adrian-Medina-Resume.pdf'],
    ])
  })
})
