const searchNames: any = {
    'name': 'name',
    'calories': 'calories',
    'fat': 'total_fat_g',
    'cholesterol': 'cholesterol_mg',
    'protein': 'protein_g',
    'carbohydrates': 'carbohydrates_g',
    'sugars': 'sugars_g',
    'sodium': 'sodium_mg',
    'vitaminA': 'vit_a_ug',
    'vitaminC': 'vit_c_mg',
    'calcium': 'calcium_mg'
};

const dbCategories = [
    'beverage',
    'dairy',
    'grain',
    'meat',
    'processed',
    'produce'
]

const dbUnits = [
    'g',
    'cup',
    'tbsp',
    'mL',
    'fl_oz',
    'oz'
]

export {searchNames, dbCategories, dbUnits};