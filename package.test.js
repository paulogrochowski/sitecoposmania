const packageJson = require('./package.json');

describe('package.json', () => {
  it('should have a name, version, and dependencies', () => {
    expect(packageJson.name).toBeDefined();
    expect(packageJson.version).toBeDefined();
    expect(packageJson.dependencies).toBeDefined();
  });

  it('should have expected dependencies', () => {
    const expectedDependencies = [
      'lucide-react',
      'next',
      'next-themes',
      'react',
      'react-dom',
    ];
    expectedDependencies.forEach(dep => {
      expect(packageJson.dependencies[dep]).toBeDefined();
    });
  });
});