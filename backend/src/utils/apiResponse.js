/**
 * Standardized API response helpers.
 */

class ApiResponse {
  /**
   * Send a success response.
   */
  static success(res, data = null, message = 'Success', statusCode = 200) {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
    });
  }

  /**
   * Send a created response (201).
   */
  static created(res, data = null, message = 'Created successfully') {
    return res.status(201).json({
      success: true,
      message,
      data,
    });
  }

  /**
   * Send a paginated response.
   */
  static paginated(res, data, pagination, message = 'Success') {
    return res.status(200).json({
      success: true,
      message,
      data,
      pagination,
    });
  }

  /**
   * Send an error response.
   */
  static error(res, message = 'Something went wrong', statusCode = 500) {
    return res.status(statusCode).json({
      success: false,
      message,
    });
  }
}

module.exports = ApiResponse;
