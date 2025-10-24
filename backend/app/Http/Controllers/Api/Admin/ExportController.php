<?php

namespace App\Http\Controllers\Api\Admin;

use App\Exports\ResultsExport;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Maatwebsite\Excel\Facades\Excel;

class ExportController extends Controller
{
    public function results(Request $request)
    {
        $format = strtolower($request->query('format', 'csv'));
        $categoryId = $request->query('category_id');
        $positionId = $request->query('position_id');

        $export = new ResultsExport($categoryId, $positionId);
        $filename = 'results_' . now()->format('Ymd_His');

        if ($format === 'xlsx' || $format === 'excel') {
            return Excel::download($export, $filename . '.xlsx');
        }
        // default CSV
        return Excel::download($export, $filename . '.csv');
    }
}