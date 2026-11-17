#!/usr/bin/env python3
"""Offline fixture audit only. No production geographic API or conformance claim."""
import json
import math
from pathlib import Path
from datetime import datetime

ROOT = Path(__file__).resolve().parents[1]
FAMILIES = {'tile_geometry', 'tile_evidence', 'arrangements', 'history', 'coverage', 'countries', 'ride_finder'}
STATES = {'accepted', 'rejected', 'uncertain'}
TRUTH = {'true': 'false', 'false': 'true', 'unknown': 'unknown'}

def require(condition, message):
    if not condition:
        raise ValueError(message)

def tile(t):
    require(isinstance(t, list) and len(t) == 3 and all(type(n) is int for n in t)
            and t[0] == 14 and all(0 <= n < 16384 for n in t[1:]), 'invalid tile')

def coordinate(c):
    require(isinstance(c, list) and len(c) == 2 and all(type(v) in (int, float) and math.isfinite(v) for v in c)
            and -180 <= c[0] <= 180 and -90 <= c[1] <= 90, 'invalid coordinate')

def offsets(items):
    require(isinstance(items, list) and all(isinstance(t, list) and len(t) == 2 and all(type(v) is int for v in t) for t in items), 'invalid offsets')
    require(len({tuple(t) for t in items}) == len(items), 'duplicate offsets')

def validate_case(family, c):
    require(set(c) == {'id','description','basis','status','input','expected','unresolved'}, 'case fields')
    require(isinstance(c['id'], str) and c['id'] and all(x.islower() or x.isdigit() or x in '-_' for x in c['id']), 'case id')
    require(isinstance(c['description'], str) and bool(c['description']), 'description')
    require(c['basis'] in {'accepted_policy','mathematical','provisional_convention'}, 'basis')
    require(c['status'] in {'resolved','partial'}, 'status')
    require(isinstance(c['unresolved'],list) and all(isinstance(x,str) and x for x in c['unresolved']), 'questions')
    require((c['status']=='partial') == bool(c['unresolved']), 'unresolved status')
    i,e=c['input'],c['expected']
    require(isinstance(i,dict) and isinstance(e,dict) and bool(e), 'inputs/expected required')
    def nulls(value):
        return value is None or (isinstance(value,dict) and any(nulls(v) for v in value.values())) or (isinstance(value,list) and any(nulls(v) for v in value))
    require(not nulls(e) or c['status']=='partial', 'unexplained unresolved outcome')
    if family=='ride_finder' and c['id']=='negation-table':
        require(i=={'truth_values':['true','false','unknown']} and e=={'negation':TRUTH}, 'truth table')
        return
    required = {
        'tile_evidence': {'positive_visit_evidence','activity_ids','distinct_activity_count','evidence_state'},
        'arrangements': {'max_square_side','all_max_square_origins','four_neighbour_component_count','veloviewer_cluster'},
        'coverage': {'raw_sample_count','sample_activity_ids','accepted_segment_indices','forbidden_connections','distinct_activity_coverage_count'},
        'countries': {'visited'},
        'ride_finder': {'result','negated_result'},
    }
    require(required.get(family,set()) <= set(e), 'required expected fields')
    if family=='tile_geometry':
        require(('coordinate' in i and ('tile' in e or 'error' in e)) or ('tile' in i and ('bounds_wsen' in e or 'error' in e)), 'geometry result completeness')
    if family=='history':
        require(bool({'checkpoints','first_visit_origin','final_visited_offsets','square_sides_at_boundaries'} & set(e)), 'history result completeness')
        for a in i.get('activities',[]) + ([i['insert']] if 'insert' in i else []):
            require(a['activity_id'].startswith('syn-') and a['timestamp'].endswith('Z'), 'historical activity provenance')
            datetime.fromisoformat(a['timestamp'].replace('Z','+00:00'))
            require(len(a['visit_evidence'])==len(a['accepted_tile_offsets']), 'historical evidence completeness')
            for j,v in enumerate(a['visit_evidence']):
                require(v==dict(activity_id=a['activity_id'],sample_index=j,timestamp=a['timestamp'],qualification='accepted',resolution='full',policy_version='syn-q1',tile_offset=a['accepted_tile_offsets'][j]), 'historical visit provenance')
    for key in ['target_tile','anchor_tile']:
        if key in i: tile(i[key])
    if 'tile' in i and not i.get('deliberate_invalid'): tile(i['tile'])
    if 'coordinate' in i and not i.get('deliberate_invalid'): coordinate(i['coordinate'])
    samples=i.get('samples',[])
    require(isinstance(samples,list), 'sample array')
    keys=set()
    for s in samples:
        require(set(s)=={'activity_id','sample_index','timestamp','coordinate','qualification','policy_version','resolution'}, 'sample fields')
        require(isinstance(s['activity_id'],str) and s['activity_id'].startswith('syn-'), 'synthetic identity')
        require(type(s['sample_index']) is int and s['sample_index']>=0, 'sample index')
        key=(s['activity_id'],s['sample_index'])
        require(key not in keys,'duplicate sample key'); keys.add(key)
        require(s['qualification'] in STATES and s['resolution']=='full' and s['policy_version'] in {'syn-q1','syn-q2'}, 'qualification provenance')
        require(s['timestamp'].endswith('Z'), 'UTC timestamp')
        datetime.fromisoformat(s['timestamp'].replace('Z','+00:00'))
        if s['coordinate'] is None:
            require(s['qualification']!='accepted', 'accepted missing coordinate')
        else: coordinate(s['coordinate'])
    for s in i.get('segments',[]):
        require(set(s)=={'from_sample','to_sample','qualification','policy_version'}, 'segment fields')
        a,b=s['from_sample'],s['to_sample']
        require(type(a) is int and type(b) is int and 0<=a<b<len(samples), 'segment reference')
        require(samples[a]['activity_id']==samples[b]['activity_id'], 'cross-activity segment')
        require(s['qualification'] in STATES and s['policy_version']=='syn-q1', 'segment qualification')
        if s['qualification']=='accepted':
            require(all(samples[j]['qualification']=='accepted' and samples[j]['coordinate'] is not None for j in [a,b]), 'accepted segment endpoints')
    if family=='tile_geometry':
        require(('error' in e) == bool(i.get('deliberate_invalid')), 'deliberate error declaration')
        if 'tile' in e:
            tile(e['tile'])
            # Test-only independent forward check of fixed, authored expectations.
            lon,lat=i['coordinate']; n=16384
            x=(lon+180)/360*n
            y=(1-math.asinh(math.tan(math.radians(lat)))/math.pi)/2*n
            # Fixture-only decimal edge snap, never a production boundary policy.
            x=round(x) if abs(x-round(x))<1e-9 else x
            y=round(y) if abs(y-round(y))<1e-9 else y
            require(e['tile']==[14,math.floor(x)%n,math.floor(y)], 'coordinate expected tile')
        if 'bounds_wsen' in e:
            z,x,y=i['tile']; n=2**z
            latitude=lambda r: math.degrees(math.atan(math.sinh(math.pi*(1-2*r/n))))
            b=[x/n*360-180,latitude(y+1),(x+1)/n*360-180,latitude(y)]
            centre=[(x+0.5)/n*360-180,latitude(y+0.5)]
            require(all(abs(a-v)<1e-12 for a,v in zip(b,e['bounds_wsen'])), 'bounds expectation')
            require(all(abs(a-v)<1e-12 for a,v in zip(centre,e['centre'])), 'centre expectation')
            for d,dx,dy in [('west',-1,0),('east',1,0),('north',0,-1),('south',0,1)]:
                require(e['neighbours'][d]==[14,x+dx,y+dy], 'neighbour expectation')
    elif family=='tile_evidence':
        require(set(e)>={'positive_visit_evidence','activity_ids','distinct_activity_count','evidence_state'}, 'tile result fields')
        require(e['distinct_activity_count']==len(set(e['activity_ids'])), 'activity count')
        require(e['positive_visit_evidence']==bool(e['activity_ids']), 'positive evidence consistency')
        require(e['evidence_state']==('positive' if e['activity_ids'] else 'insufficient'), 'evidence label')
        accepted={s['activity_id'] for s in samples if s['qualification']=='accepted'}
        require(set(e['activity_ids'])<=accepted, 'unqualified visit')
        if not accepted: require(not e['positive_visit_evidence'], 'rejected visit')
    elif family=='arrangements':
        offsets(i['visited_offsets']); offsets(e['all_max_square_origins'])
        visited={tuple(t) for t in i['visited_offsets']}; side=e['max_square_side']
        require(type(side) is int and side>=0, 'square side')
        # Bounded exhaustive certificate audit of these tiny sets, not production DP.
        certificates=[]
        for x,y in visited:
            if side and all((x+dx,y+dy) in visited for dx in range(side) for dy in range(side)):
                certificates.append([x,y])
            require(not all((x+dx,y+dy) in visited for dx in range(side+1) for dy in range(side+1)), 'larger square exists')
        require(sorted(certificates)==sorted(e['all_max_square_origins']), 'square certificate completeness')
        require(bool(visited)==bool(side), 'empty square')
        interior={t for t in visited if all(n in visited for n in [(t[0]-1,t[1]),(t[0]+1,t[1]),(t[0],t[1]-1),(t[0],t[1]+1)])}
        require(set(map(tuple,e['four_neighbour_interior_offsets']))==interior and set(map(tuple,e['four_neighbour_boundary_offsets']))==visited-interior, 'interior/boundary certificate')
        # Generic four-neighbour connectivity only; explicitly not VeloViewer clusters.
        remaining=set(visited); component_count=0
        while remaining:
            component_count+=1; pending=[remaining.pop()]
            while pending:
                x,y=pending.pop()
                for neighbour in [(x-1,y),(x+1,y),(x,y-1),(x,y+1)]:
                    if neighbour in remaining:
                        remaining.remove(neighbour); pending.append(neighbour)
        require(e['four_neighbour_component_count']==component_count, 'generic component count')
        require(e['veloviewer_cluster'] is None, 'unverified cluster result')
    elif family=='history':
        if 'checkpoints' in e:
            activities=i['activities']; checkpoints=e['checkpoints']; visited=set(); attained=[]; largest=0
            require(len(activities)==len(checkpoints), 'checkpoint completeness')
            for a,p in zip(activities,checkpoints):
                offsets(a['accepted_tile_offsets']); visited.update(map(tuple,a['accepted_tile_offsets']))
                require(p['after']==a['activity_id'] and set(map(tuple,p['visited_offsets']))==visited and p['visited_count']==len(visited), 'historical snapshot')
                if p['max_square_side']>largest:
                    attained.append(p['max_square_side']); largest=p['max_square_side']
                    require(p['new_square_milestone']==largest, 'milestone')
                else: require(p['new_square_milestone'] is None, 'unattained milestone')
            require(e['attained_milestones']==attained, 'attained milestones')
        if 'final_visited_offsets' in e: require(len(e['final_visited_offsets'])==e['final_visited_count'],'invalidated count')
        if 'square_sides_at_boundaries' in e: require(e['attained_milestones']==e['square_sides_at_boundaries'],'fabricated milestone')
    elif family=='coverage':
        require(e['raw_sample_count']==len(samples), 'raw sample count')
        require(e['sample_activity_ids']==sorted({s['activity_id'] for s in samples if s['qualification']=='accepted'}), 'coverage activity identities')
        require(e['accepted_segment_indices']==[j for j,s in enumerate(i['segments']) if s['qualification']=='accepted'], 'segment support')
        require(e['forbidden_connections']==[[s['from_sample'],s['to_sample']] for s in i['segments'] if s['qualification']!='accepted'], 'forbidden connections')
        if e['distinct_activity_coverage_count'] is not None: require(e['distinct_activity_coverage_count']==len(e['sample_activity_ids']), 'sample-density substitution')
    elif family=='countries':
        require(i['boundary_version']=='syn-country-v1', 'boundary version')
        for name,ring in i['boundaries'].items():
            require(name.startswith('syn-') and len(ring)>=4 and ring[0]==ring[-1], 'synthetic polygon')
            for p in ring: coordinate(p)
        if e['visited'] is not None: require(set(e['visited'])<=set(i['boundaries']), 'country reference')
        if 'allocated_units' in e:
            require(set(e['allocated_units'])<=set(i['boundaries']), 'allocation reference')
            require(abs(sum(e['allocated_units'].values())+e['unallocated_units']+e['uncertain_units']-i['toy_length_units'])<1e-9, 'distance conservation')
        for v in e.get('first_visit',{}).values(): require((v['activity_id'],v['sample_index']) in keys, 'first visit provenance')
    elif family=='ride_finder':
        require(i['predicate'] in {'starts','ends','traverses','sample_presence','segment_intersection'}, 'predicate')
        require(i['evidence_completeness'] in {'complete_for_predicate','incomplete','unresolved'}, 'completeness')
        area=i['area']; require(area['type'] in {'rectangle','polygon','point_radius','tile'}, 'area type')
        if area['type']=='tile': tile(area['tile'])
        if area['type']=='polygon':
            require(area['ring'][0]==area['ring'][-1], 'polygon closure')
            for p in area['ring']: coordinate(p)
        if area['type']=='point_radius': coordinate(area['centre']); require(area['radius_units']>0,'radius')
        if area['type']=='rectangle':
            w,s,ee,n=area['bounds']; coordinate([w,s]); coordinate([ee,n]); require(w<ee and s<n,'rectangle bounds')
        result=e['result']
        if result is not None:
            require(result in TRUTH and e['negated_result']==TRUTH[result], 'three-valued negation')
            require(not (i['evidence_completeness']=='incomplete' and result=='false'), 'incomplete negative')

def load_documents():
    return [json.loads(p.read_text(),parse_constant=lambda s: (_ for _ in ()).throw(ValueError('non-finite JSON'))) for p in sorted((ROOT/'fixtures').glob('*.json'))]

def validate(documents):
    require(len(documents)==len(FAMILIES) and {d['family'] for d in documents}==FAMILIES, 'fixture families')
    registry={}; counts={}
    for d in documents:
        require(set(d)=={'format_version','family','synthetic','cases'} and d['format_version']==1 and d['synthetic'] is True, 'document envelope')
        f=d['family']; require(isinstance(d['cases'],list) and bool(d['cases']), 'cases required'); counts[f]=len(d['cases'])
        for c in d['cases']:
            key=f+'/'+c['id']; require(key not in registry, 'duplicate case id'); registry[key]=c
            try: validate_case(f,c)
            except (KeyError,TypeError,ValueError,IndexError) as ex: raise ValueError(f'{key}: {ex}') from ex
    for c in registry.values():
        if 'base_case' in c['input']: require(c['input']['base_case'] in registry, 'base case reference')
    return counts

if __name__=='__main__':
    counts=validate(load_documents())
    for family,count in counts.items(): print(f'{family}: {count}')
    print(f'PASS: {sum(counts.values())} fixtures; structural and bounded expectation audits only.')
