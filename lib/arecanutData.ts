export interface ArecanutDiseaseInfo {
  id: string;
  name: string;
  category: 'Healthy' | 'Fungal' | 'Pest' | 'Physiological' | 'Viral/Phytoplasma';
  affectedPart: 'Leaf' | 'Nut' | 'Trunk' | 'Foot' | 'Bud';
  symptoms: string;
  chemicalRemedy: string;
  organicRemedy: string;
  prevention: string;
}

export const ARECANUT_DISEASES: Record<string, ArecanutDiseaseInfo> = {
  Healthy_Leaf: {
    id: 'Healthy_Leaf',
    name: 'Healthy Arecanut Leaf',
    category: 'Healthy',
    affectedPart: 'Leaf',
    symptoms: 'Vibrant green foliage with no discoloration or fungal spots.',
    chemicalRemedy: 'No chemical treatment needed.',
    organicRemedy: 'Maintain regular organic mulching and compost application.',
    prevention: 'Ensure balanced fertilization and proper drainage.'
  },
  Healthy_Nut: {
    id: 'Healthy_Nut',
    name: 'Healthy Arecanut Nut',
    category: 'Healthy',
    affectedPart: 'Nut',
    symptoms: 'Firm, well-developed green nuts with no rotting or dropping.',
    chemicalRemedy: 'No chemical treatment needed.',
    organicRemedy: 'Apply vermicompost twice a year around the root zone.',
    prevention: 'Avoid excess humidity during fruit setting.'
  },
  Healthy_Trunk: {
    id: 'Healthy_Trunk',
    name: 'Healthy Arecanut Trunk',
    category: 'Healthy',
    affectedPart: 'Trunk',
    symptoms: 'Clean, strong trunk without exudations or vertical cracks.',
    chemicalRemedy: 'No chemical treatment needed.',
    organicRemedy: 'Paint lower trunk with lime wash.',
    prevention: 'Protect young palms from direct scorching sun rays.'
  },
  healthy_foot: {
    id: 'healthy_foot',
    name: 'Healthy Arecanut Foot / Base',
    category: 'Healthy',
    affectedPart: 'Foot',
    symptoms: 'Healthy root system and base without basal rot.',
    chemicalRemedy: 'No chemical treatment needed.',
    organicRemedy: 'Apply Trichoderma harzianum enriched neem cake.',
    prevention: 'Prevent water stagnation around the palm base.'
  },
  Mahali_Koleroga: {
    id: 'Mahali_Koleroga',
    name: 'Mahali / Koleroga (Fruit Rot)',
    category: 'Fungal',
    affectedPart: 'Nut',
    symptoms: 'Dark water-soaked lesions on nuts followed by premature rotting and heavy fruit drop during monsoon.',
    chemicalRemedy: 'Spray 1% Bordeaux mixture or Copper Oxychloride (3 g/L) before monsoon onset.',
    organicRemedy: 'Spray Bio-control agent Pseudomonas fluorescens (10g/L) and clear infected fallen nuts.',
    prevention: 'Cover nut bunches with polythene covers before heavy rains.'
  },
  Stem_bleeding: {
    id: 'Stem_bleeding',
    name: 'Stem Bleeding (Theleson Rot)',
    category: 'Fungal',
    affectedPart: 'Trunk',
    symptoms: 'Exudation of dark reddish-brown fluid from cracks on the trunk lower region.',
    chemicalRemedy: 'Scrape infected bark tissues and apply Coal Tar + Tridemorph (0.1%) or Copper Oxychloride (5 g/L).',
    organicRemedy: 'Apply Neem paste mixed with Trichoderma viride over scraped lesions.',
    prevention: 'Avoid mechanical injuries to the trunk during harvesting.'
  },
  bud_borer: {
    id: 'bud_borer',
    name: 'Bud Borer Insect Infestation',
    category: 'Pest',
    affectedPart: 'Bud',
    symptoms: 'Borer larvae tunnel into the central spindle leaf causing leaf distortion and rotting of tender buds.',
    chemicalRemedy: 'Pour Chlorpyrifos 20 EC (2 ml/L) or Quinalphos (2 ml/L) into the leaf axils.',
    organicRemedy: 'Apply Neem Oil (5 ml/L) with soap solution directly into spindle leaf axils.',
    prevention: 'Clean palm crowns periodically to remove dry leaf sheaths.'
  },
  'stem cracking': {
    id: 'stem cracking',
    name: 'Stem Cracking',
    category: 'Physiological',
    affectedPart: 'Trunk',
    symptoms: 'Longitudinal splitting of trunk tissues due to sudden moisture variation or nutritional imbalance.',
    chemicalRemedy: 'Drench soil with Copper Oxychloride (0.3%) to avoid secondary infection.',
    organicRemedy: 'Apply organic mulch around palm base and apply Borax (25g per palm).',
    prevention: 'Maintain uniform irrigation during dry spells.'
  },
  'yellow leaf disease': {
    id: 'yellow leaf disease',
    name: 'Yellow Leaf Disease (YLD)',
    category: 'Viral/Phytoplasma',
    affectedPart: 'Leaf',
    symptoms: 'Yellowing of outer whorl of leaves starting from tips, leading to crown reduction and kernel rot.',
    chemicalRemedy: 'Foliar spray of Fosetyl-Al (0.2%) or Potassium Phosphonate (0.3%) + Oxytetracycline.',
    organicRemedy: 'Soil application of Neem cake (2 kg/palm) + bio-fertilizers (Azospirillum & PSB).',
    prevention: 'Improve soil aeration and eradicate vector insects.'
  }
};
