const scenarios = {
  finance: {
    title: 'Financial services pilot-to-scale',
    subtitle: 'Illustrative baseline for a regulated organization moving from experiments to governed adoption.',
    state: 'Governed scale posture',
    clauses: [
      ['Outcome', 'Select workflows where customer, risk, and operating value can be evidenced together.'],
      ['Authority', 'Board sponsor, accountable business owner, risk partner, and clear retained human judgment.'],
      ['Portfolio', 'A deliberately small set of funded bets, enabling foundations, and explicit stop rules.'],
      ['Guardrails', 'Acceptable use, data and model controls, vendor accountability, exceptions, and audit evidence.'],
      ['Adoption', 'Workflow owners, role-based training, frontline feedback, and behavior measures.'],
      ['Continuity', 'Decision records, operating cadence, talent plan, and a defined permanent-owner handoff.']
    ],
    result: 'Start with governance and portfolio selection in the same executive conversation.',
    handoff: 'Transfer when decision rights and evidence cadence no longer depend on the fractional leader.'
  },
  services: {
    title: 'Professional services leverage',
    subtitle: 'Illustrative baseline for scaling repeatable AI-enabled delivery without eroding trust or craft.',
    state: 'Reusable delivery posture',
    clauses: [
      ['Outcome', 'Reduce recurring effort while protecting client value, judgment, and differentiated expertise.'],
      ['Authority', 'Practice sponsor, delivery owner, knowledge owner, and escalation path for client-sensitive work.'],
      ['Portfolio', 'Prioritize repeatable workflows with strong context, reuse, and proof potential.'],
      ['Guardrails', 'Client confidentiality, source traceability, review thresholds, and release criteria.'],
      ['Adoption', 'Practitioner co-design, playbooks, coaching, and evidence that the workflow stays in use.'],
      ['Continuity', 'Reusable assets, capability owners, enablement cadence, and partner-level investment rules.']
    ],
    result: 'Fund the workflows that compound knowledge, not simply the most visible demos.',
    handoff: 'Transfer when practices can govern, measure, and improve the workflow without external prompting.'
  },
  industrial: {
    title: 'Industrial operations intelligence',
    subtitle: 'Illustrative baseline for connecting machine, quality, customer, and operating signals to action.',
    state: 'Workflow reliability posture',
    clauses: [
      ['Outcome', 'Improve throughput, quality, service, or uptime through decisions closer to the work.'],
      ['Authority', 'Operational owner, technical owner, quality or safety authority, and defined intervention rights.'],
      ['Portfolio', 'Choose use cases with accessible signals, clear workflow owners, and measurable operating consequences.'],
      ['Guardrails', 'Safety, quality, access, change control, fallback, and traceable human override.'],
      ['Adoption', 'Standard work, operator feedback, coaching, exception learning, and visible local wins.'],
      ['Continuity', 'Telemetry review, issue cadence, maintenance ownership, and capability transfer into operations.']
    ],
    result: 'Attach AI to the operating mechanism and exception path before optimizing the model.',
    handoff: 'Transfer when operating teams own the signal, action, exception, and learning loop.'
  },
  growth: {
    title: 'AI-enabled growth company',
    subtitle: 'Illustrative baseline for a scaling organization balancing speed, platform choice, and operating discipline.',
    state: 'Scale-with-control posture',
    clauses: [
      ['Outcome', 'Clarify which AI capabilities create durable product, customer, or operating advantage.'],
      ['Authority', 'CEO sponsor, product or operating owner, technical authority, and explicit release decision.'],
      ['Portfolio', 'Separate differentiating capabilities from commodities that should be bought or partnered.'],
      ['Guardrails', 'Data rights, security, cost and latency budgets, evaluation, fallback, and vendor exit conditions.'],
      ['Adoption', 'Product and workflow instrumentation, enablement, support, and rapid learning from real use.'],
      ['Continuity', 'Hiring sequence, platform ownership, investment gates, and permanent executive mandate.']
    ],
    result: 'Use speed to learn, but make ownership and evidence travel with every release.',
    handoff: 'Transfer when the company has a stable executive mandate, technical owner, and investment logic.'
  }
};

function renderScenario(key, animate = true) {
  const board = document.querySelector('.charter-board');
  if (!board) return;
  const scenario = scenarios[key];
  document.querySelectorAll('.scenario-button').forEach((button) => {
    button.setAttribute('aria-selected', String(button.dataset.scenario === key));
  });
  board.classList.remove('is-locked');
  const update = () => {
    document.querySelector('[data-charter-title]').textContent = scenario.title;
    document.querySelector('[data-charter-subtitle]').textContent = scenario.subtitle;
    document.querySelector('[data-charter-state]').textContent = scenario.state;
    document.querySelectorAll('.charter-clause').forEach((clause, index) => {
      clause.querySelector('h3').textContent = scenario.clauses[index][0];
      clause.querySelector('p').textContent = scenario.clauses[index][1];
    });
    document.querySelector('[data-result]').textContent = scenario.result;
    document.querySelector('[data-handoff]').textContent = scenario.handoff;
    board.dataset.activeScenario = key;
    requestAnimationFrame(() => board.classList.add('is-locked'));
  };
  if (animate && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    window.setTimeout(update, 180);
  } else {
    update();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('img[data-brand-logo]').forEach((image) => {
    image.addEventListener('error', () => {
      image.style.display = 'none';
      const fallback = image.parentElement.querySelector('.brand-text-fallback');
      if (fallback) fallback.style.display = 'inline-block';
    });
  });
  document.querySelectorAll('.scenario-button').forEach((button) => {
    button.addEventListener('click', () => renderScenario(button.dataset.scenario));
  });
  const reset = document.querySelector('[data-reset-charter]');
  if (reset) reset.addEventListener('click', () => renderScenario('finance'));
  renderScenario('finance', false);
});
