"""노동경제학 개념의 JEL 분류 코드 대응(검증된 STW·Wikidata 대응은 아직 없음 — 확인 필요 목록에 남김)."""
JEL_TITLE = {'J01': 'Labor Economics: General', 'J21': 'Labor Force and Employment, Size, and Structure', 'J22': 'Time Allocation and Labor Supply',
             'J23': 'Labor Demand', 'J24': 'Human Capital; Skills; Occupational Choice; Labor Productivity', 'J31': 'Wage Level and Structure; Wage Differentials',
             'J28': 'Safety; Job Satisfaction; Related Public Policy', 'J38': 'Wages, Compensation, and Labor Costs: Public Policy', 'J42': 'Monopsony; Segmented Labor Markets',
             'J61': 'Geographic Labor Mobility; Immigrant Workers', 'J64': 'Unemployment: Models, Duration, Incidence, and Job Search', 'J17': 'Value of Life; Forgone Income',
             'I26': 'Returns to Education', 'D63': 'Equity, Justice, Inequality, and Other Normative Criteria and Measurement', 'J15': 'Economics of Minorities, Races, Indigenous Peoples, and Immigrants',
             'O33': 'Technological Change: Choices and Consequences; Diffusion Processes', 'H24': 'Personal Income and Other Nonbusiness Taxes and Subsidies'}
def _v(*j): return {'jel': list(j), 'rel': 'closeMatch'}
VOCAB = {
 'labor-market': _v('J01', 'J21'), 'wage-equation': _v('J31', 'I26'), 'labor-statistics': _v('J21', 'J64'), 'discouraged-worker': _v('J64'),
 'leisure-consumption-choice': _v('J22'), 'optimal-labor-supply': _v('J22'), 'reservation-wage': _v('J22', 'J64'), 'income-substitution-effects': _v('J22'),
 'labor-supply-curve': _v('J22'), 'eitc': _v('J22', 'H24'), 'short-run-labor-demand': _v('J23'), 'long-run-labor-demand': _v('J23'), 'production-functions-ai': _v('J23', 'O33'),
 'competitive-equilibrium': _v('J31', 'J61'), 'minimum-wage': _v('J38', 'J42'), 'immigration-surplus': _v('J61', 'J15'), 'compensating-differential': _v('J31', 'J28'),
 'hedonic-wage-function': _v('J31', 'J28'), 'value-of-statistical-life': _v('J17', 'J28'), 'schooling-model': _v('I26', 'J24'), 'stopping-rule': _v('I26', 'J24'),
 'ability-bias': _v('I26', 'J31'), 'on-the-job-training': _v('J24'), 'inequality-measures': _v('D63', 'J31'), 'skill-biased-technical-change': _v('J31', 'O33'),
 'migration-investment': _v('J61'), 'roy-model': _v('J61', 'J15'), 'immigrant-assimilation': _v('J61', 'J15'),
 'term/unemployment-rate': _v('J64'), 'term/monopsony': _v('J42'), 'term/signaling': _v('J24'), 'term/gini': _v('D63')}
