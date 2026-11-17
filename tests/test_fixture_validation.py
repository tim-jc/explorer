"""Mutation tests ensure the audit rejects malformed evidence; no runtime dependencies."""
import copy
import sys
import unittest
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parents[1]/'scripts'))
from validate_fixtures import load_documents, validate

class FixtureValidationTests(unittest.TestCase):
    def setUp(self): self.docs=load_documents()
    def case(self,f): return next(d for d in self.docs if d['family']==f)['cases'][0]
    def rejected(self,mutation):
        mutation()
        with self.assertRaises(ValueError): validate(self.docs)
    def test_complete_suite(self): self.assertEqual(sum(validate(self.docs).values()),96)
    def test_explicit_truth_table(self):
        c=next(c for d in self.docs if d['family']=='ride_finder' for c in d['cases'] if c['id']=='negation-table')
        self.rejected(lambda:c['expected']['negation'].update(unknown='true'))
    def test_historical_provenance(self):
        self.rejected(lambda:self.case('history')['input']['activities'][0]['visit_evidence'][0].pop('sample_index'))
    def test_missing_expected_field(self):
        self.rejected(lambda:self.case('tile_evidence')['expected'].pop('activity_ids'))
    def test_duplicate_id(self):
        d=self.docs[0]; self.rejected(lambda:d['cases'].append(copy.deepcopy(d['cases'][0])))
    def test_missing_family(self): self.rejected(lambda:self.docs.pop())
    def test_missing_field(self): self.rejected(lambda:self.case('tile_evidence').pop('description'))
    def test_unknown_basis(self): self.rejected(lambda:self.case('coverage').update(basis='empirically_verified'))
    def test_invalid_qualification(self): self.rejected(lambda:self.case('tile_evidence')['input']['samples'][0].update(qualification='probably'))
    def test_missing_provenance(self): self.rejected(lambda:self.case('tile_evidence')['input']['samples'][0].pop('policy_version'))
    def test_bad_time(self): self.rejected(lambda:self.case('tile_evidence')['input']['samples'][0].update(timestamp='tomorrow'))
    def test_real_identity(self): self.rejected(lambda:self.case('tile_evidence')['input']['samples'][0].update(activity_id='12345'))
    def test_invalid_coordinate(self): self.rejected(lambda:self.case('tile_evidence')['input']['samples'][0].update(coordinate=[181,0]))
    def test_accepted_missing(self): self.rejected(lambda:self.case('tile_evidence')['input']['samples'][0].update(coordinate=None))
    def test_duplicate_sample(self):
        s=self.case('tile_evidence')['input']['samples']; self.rejected(lambda:s.append(copy.deepcopy(s[0])))
    def test_invalid_tile(self): self.rejected(lambda:self.case('tile_evidence')['input'].update(target_tile=[14,16384,0]))
    def test_unknown_not_false(self):
        c=next(c for d in self.docs if d['family']=='ride_finder' for c in d['cases'] if c['id']=='no-gps')
        self.rejected(lambda:c['expected'].update(negated_result='true'))
    def test_incomplete_negative(self):
        c=next(c for d in self.docs if d['family']=='ride_finder' for c in d['cases'] if c['id']=='no-gps')
        self.rejected(lambda:c['expected'].update(result='false',negated_result='true'))
    def test_broken_reference(self): self.rejected(lambda:self.case('history')['input'].update(base_case='history/absent'))
    def test_unexplained_unresolved(self): self.rejected(lambda:self.case('arrangements').update(unresolved=[]))
    def test_invented_square(self): self.rejected(lambda:self.case('arrangements')['expected'].update(max_square_side=2))
    def test_missing_square_tie(self):
        c=next(c for d in self.docs if d['family']=='arrangements' for c in d['cases'] if c['id']=='tied-squares')
        self.rejected(lambda:c['expected']['all_max_square_origins'].pop())
    def test_broken_segment(self): self.rejected(lambda:self.case('coverage')['input']['segments'][0].update(to_sample=99))
    def test_density_as_coverage(self): self.rejected(lambda:self.case('coverage')['expected'].update(distinct_activity_coverage_count=2))
    def test_distance_loss(self):
        c=next(c for d in self.docs if d['family']=='countries' for c in d['cases'] if c['id']=='cross-border')
        self.rejected(lambda:c['expected'].update(unallocated_units=1))
    def test_wrong_mathematics(self): self.rejected(lambda:self.case('tile_geometry')['expected'].update(tile=[14,0,0]))
    def test_historical_current_state_leak(self): self.rejected(lambda:self.case('history')['expected']['checkpoints'][0].update(visited_count=10))

if __name__=='__main__': unittest.main()
