<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Responses\ApiResponse as ApiResponseTrait;

/**
 * Base Controller for API responses.
 * All API V1 controllers should extend this class.
 */
abstract class ApiController extends Controller
{
    use ApiResponseTrait;
}
