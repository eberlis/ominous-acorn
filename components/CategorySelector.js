import { useState, useMemo } from 'react';
import { CATEGORIES_LIST, getCategoryById } from '../lib/expenseCategories';
import { loadCustomCategories } from '../lib/expenseStorage';
import styles from './CategorySelector.module.css';

export default function CategorySelector({ selectedCategory, onSelect, showCustom = true }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [customCategories, setCustomCategories] = useState(loadCustomCategories());

  // Combine predefined and custom categories
  const allCategories = useMemo(() => {
    return showCustom ? [...CATEGORIES_LIST, ...customCategories] : CATEGORIES_LIST;
  }, [customCategories, showCustom]);

  // Filter categories based on search
  const filteredCategories = useMemo(() => {
    if (!searchTerm) return allCategories;
    
    const lowerSearch = searchTerm.toLowerCase();
    return allCategories.filter(cat =>
      cat.name.toLowerCase().includes(lowerSearch) ||
      cat.id.toLowerCase().includes(lowerSearch)
    );
  }, [allCategories, searchTerm]);

  const handleSelect = (categoryId) => {
    onSelect(categoryId);
  };

  const selectedCat = getCategoryById(selectedCategory);

  return (
    <div className={styles.container}>
      <div className={styles.searchBox}>
        <input
          type="text"
          placeholder="Search categories..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchInput}
        />
      </div>

      <div className={styles.categoriesGrid}>
        {filteredCategories.map((category) => {
          const isSelected = category.id === selectedCategory;
          return (
            <button
              key={category.id}
              type="button"
              onClick={() => handleSelect(category.id)}
              className={`${styles.categoryCard} ${isSelected ? styles.selected : ''}`}
              style={{
                borderColor: isSelected ? category.color : 'transparent',
                backgroundColor: isSelected ? `${category.color}15` : 'transparent'
              }}
            >
              <span className={styles.icon}>{category.icon}</span>
              <span className={styles.name}>{category.name}</span>
            </button>
          );
        })}
      </div>

      {filteredCategories.length === 0 && (
        <div className={styles.emptyState}>
          <p>No categories found matching "{searchTerm}"</p>
        </div>
      )}
    </div>
  );
}
