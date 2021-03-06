/* globals describe it expect */

import { node } from 'wilderness-dom-node'
import render from '../src/render'
import shape from '../src/shape'
import timeline, { play, tick } from '../src/timeline'

describe('timeline', () => {
  it('should not change core timeline behaviour', () => {
    const alternate = true
    const duration = 500
    const initialIterations = 0.5
    const iterations = 3
    const reverse = true
    const started = 10
    const s = shape({ type: 'path', d: 'M0,0H10' }, { type: 'path', d: 'M10,0H20' })
    const t = timeline(s, { alternate, duration, initialIterations, iterations, reverse, started })
    expect(t).to.have.property('middleware')
    expect(t).to.have.property('playbackOptions')
    expect(t).to.have.property('state')
    expect(t).to.have.property('timelineShapes')
    expect(t.playbackOptions.alternate).to.equal(alternate)
    expect(t.playbackOptions.duration).to.equal(duration)
    expect(t.playbackOptions.initialIterations).to.equal(initialIterations)
    expect(t.playbackOptions.iterations).to.equal(iterations)
    expect(t.playbackOptions.reverse).to.equal(reverse)
    expect(t.playbackOptions.started).to.equal(started)
    expect(t.state.started).to.equal(true)
  })
})

describe('play', () => {
  it('should not change core play behaviour', () => {
    const at = 50
    const t = timeline(shape({ type: 'path', d: 'M0,0H10' }, { type: 'path', d: 'M10,0H20' }))
    expect(t.state.started).to.equal(false)
    play(t, {}, at)
    expect(t.playbackOptions.started).to.equal(at)
    expect(t.state.started).to.equal(true)
  })
})

describe('tick', () => {
  it('should throw if passed an invalid at option', () => {
    expect(() => tick({ at: 'potato', bypassTickingCheck: true }))
      .to.throw('The tick functions at option must be of type number')
  })

  it('should update active Timelines', () => {
    const s = shape({ type: 'path', d: 'M0,0H10' }, { type: 'path', d: 'M10,0H20' })
    const t = timeline(s, { duration: 1000, started: 0 })

    const preTickExpectedEl = node({
      attributes: {},
      points: [{ x: 0, y: 0, moveTo: true }, { x: 10, y: 0 }]
    })

    const postTickExpectedEl = node({
      attributes: {},
      points: [{ x: 5, y: 0, moveTo: true }, { x: 15, y: 0 }]
    })

    render(document.createElementNS('http://www.w3.org/2000/svg', 'svg'), t)

    expect(s.node.toString()).to.eql(preTickExpectedEl.toString())

    tick({ at: 500, recurse: false })

    expect(s.node.toString()).to.eql(postTickExpectedEl.toString())
  })
})
