import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, find } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | Badges::Badge', function(hooks) {
  let badge;

  setupRenderingTest(hooks);

  hooks.beforeEach(function() {
    badge = {
      id: 42,
      title: 'mon titre',
      message: 'mon message',
      imageUrl: 'data:,',
      key: 'ma clef',
      altMessage: 'mon message alternatif',
    };

    this.set('badge', badge);
  });

  test('should render all details about the badge', async function(assert) {
    //when
    await render(hbs`<Badges::Badge @model={{this.badge}} />`);

    //then
    assert.dom('.page-section__details').exists();
    const detailsContent = find('.page-section__details').textContent;
    assert.ok(detailsContent.match(badge.title), 'title');
    assert.ok(detailsContent.match(badge.key), 'key');
    assert.ok(detailsContent.match(badge.message), 'message');
    assert.ok(detailsContent.match(badge.id), 'id');
    assert.ok(detailsContent.match(badge.altMessage), 'altMessage');
    assert.dom('.page-section__details img').exists();
    assert.dom('.page-section__details img').hasAttribute('src', 'data:,');
  });
});
