using ACadSharp;
using ACadSharp.IO;
using ACadSharp.Entities;
using CSMath;

// Generate reference DWG files using the C# ACadSharp library
// These are used to compare against TypeScript ACadSharp output

var versions = new (ACadVersion version, string name)[]
{
    (ACadVersion.AC1014, "AC1014"),
    (ACadVersion.AC1015, "AC1015"),
    (ACadVersion.AC1018, "AC1018"),
    (ACadVersion.AC1024, "AC1024"),
    (ACadVersion.AC1027, "AC1027"),
    (ACadVersion.AC1032, "AC1032"),
};

string outDir = Path.Combine(args.Length > 0 ? args[0] : ".", "csharp-ref-dwg");
Directory.CreateDirectory(outDir);

foreach (var (version, name) in versions)
{
    var doc = new CadDocument();
    doc.Header.Version = version;

    var point = new Point(new XYZ(10, 5, 0));
    var line = new Line(new XYZ(0, 0, 0), new XYZ(50, 30, 0));

    doc.Entities.Add(point);
    doc.Entities.Add(line);

    string outPath = Path.Combine(outDir, $"simple_{name}.dwg");
    using (var writer = new DwgWriter(outPath, doc))
    {
        writer.Write();
    }

    var fi = new FileInfo(outPath);
    Console.WriteLine($"Written: {outPath} ({fi.Length} bytes)");

    // Dump object info for comparison
    if (name == "AC1015")
    {
        Console.WriteLine($"  BlockRecords: {doc.BlockRecords.Count}");
        Console.WriteLine($"  Layers: {doc.Layers.Count}");
        Console.WriteLine($"  LineTypes: {doc.LineTypes.Count}");
        Console.WriteLine($"  TextStyles: {doc.TextStyles.Count}");
        Console.WriteLine($"  DimStyles: {doc.DimensionStyles.Count}");
        Console.WriteLine($"  AppIds: {doc.AppIds.Count}");
        Console.WriteLine($"  VPorts: {doc.VPorts.Count}");
        Console.WriteLine($"  Classes: {doc.Classes.Count}");
        var entryCount = 0;
        foreach (var entry in doc.RootDictionary)
        {
            entryCount++;
            Console.WriteLine($"    {entry.Name}: {entry.GetType().Name}");
        }
        Console.WriteLine($"  RootDict entries: {entryCount}");
    }
}

Console.WriteLine("Done.");

// Try reading TS-generated files with C# library
Console.WriteLine("\n--- Reading TS-generated files ---");
string[] tsDirs = [
    Path.Combine(args.Length > 0 ? args[0] : ".", "generated", "simple"),
    args.Length > 0 ? args[0] : ".",
];
foreach (string tsDir in tsDirs)
{
if (Directory.Exists(tsDir))
{
    foreach (var file in Directory.GetFiles(tsDir, "*.dwg"))
    {
        try
        {
            using var reader = new DwgReader(file);
            var doc = reader.Read();
            Console.WriteLine($"OK: {Path.GetFileName(file)} - {doc.Entities.Count()} entities, {doc.Layers.Count} layers");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"FAIL: {Path.GetFileName(file)} - {ex.Message}");
        }
    }
}
else
{
    Console.WriteLine($"TS output dir not found: {tsDir}");
}
}
